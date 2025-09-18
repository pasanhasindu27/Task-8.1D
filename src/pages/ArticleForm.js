import React, { useState, useRef } from "react";
import {
  Form,
  TextArea,
  Button,
  Input,
  Segment,
  Label,
  Image,
  Message,
} from "semantic-ui-react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ArticleForm() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    articleText: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedURL, setUploadedURL] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const [posting, setPosting] = useState(false);
  const [postDone, setPostDone] = useState(false);

  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setUploadDone(false);
      setUploadedURL("");
    }
  };

  // Upload image
  const handleImageUpload = async () => {
    if (!image) {
      setMessage({ type: "error", text: "⚠ Please select an image first." });
      return;
    }
    try {
      setUploading(true);
      const imageRef = ref(storage, `articles/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      setUploadedURL(url);
      setUploadDone(true);
      setMessage({ type: "success", text: "✅ Image uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "❌ Failed to upload image." });
    } finally {
      setUploading(false);
    }
  };

  // Submit article
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.abstract || !formData.articleText) {
      setMessage({ type: "error", text: "⚠ Please fill in all required fields." });
      return;
    }

    try {
      setPosting(true);
      let finalImageURL = uploadedURL;

      if (image && !uploadedURL) {
        const imageRef = ref(storage, `articles/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        finalImageURL = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        type: "article",
        title: formData.title,
        abstract: formData.abstract,
        articleText: formData.articleText,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        imageURL: finalImageURL || "",
        createdAt: serverTimestamp(),
      });

      setPostDone(true);
      setMessage({ type: "success", text: "✅ Article posted successfully!" });

      // reset form
      setFormData({ title: "", abstract: "", articleText: "", tags: "" });
      setImage(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Save error:", error);
      setMessage({ type: "error", text: "❌ Failed to post article." });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "2em auto" }}>
      <Segment>
        <Label attached="top">New Article</Label>

        <Form.Field
          control={Input}
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Form.Field
          control={TextArea}
          label="Abstract"
          name="abstract"
          value={formData.abstract}
          onChange={handleChange}
          required
        />
        <Form.Field
          control={TextArea}
          label="Article Text"
          name="articleText"
          value={formData.articleText}
          onChange={handleChange}
          required
        />
        <Form.Field
          control={Input}
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />

        {/* Image Upload */}
        <Form.Field>
          <label>Add an Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <Button
            type="button"
            color={uploadDone ? "green" : "grey"}
            onClick={handleImageUpload}
            disabled={!image || uploadDone}
            loading={uploading}
            size="small"
            style={{ marginTop: "5px" }}
          >
            {uploadDone ? "Done" : "Upload"}
          </Button>

          {imagePreview && (
            <div style={{ marginTop: "10px" }}>
              <Image src={imagePreview} size="small" bordered />
            </div>
          )}
        </Form.Field>

        {/* Submit */}
        <Button
          type="submit"
          color={postDone ? "green" : "blue"}
          loading={posting}
          disabled={posting}
        >
          {postDone ? "Done" : "Post Article"}
        </Button>

        {message && (
          <Message
            positive={message.type === "success"}
            negative={message.type === "error"}
            style={{ marginTop: "1em" }}
          >
            {message.text}
          </Message>
        )}
      </Segment>
    </Form>
  );
}
