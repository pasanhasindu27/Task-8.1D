import React, { useState, useRef } from "react";
import {
  Form,
  Radio,
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

export default function PostForm() {
  const [postType, setPostType] = useState("question");
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedURL, setUploadedURL] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const [posting, setPosting] = useState(false);
  const [postDone, setPostDone] = useState(false);

  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();

  // Handle form inputs
  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  // Switch post type
  const handlePostTypeChange = (e, { value }) => {
    setPostType(value);
    setFormData({});
    setImage(null);
    setImagePreview("");
    setUploadedURL("");
    setUploadDone(false);
    setPostDone(false);
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Choose file
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
      const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
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

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPosting(true);
      setMessage(null);

      let finalImageURL = uploadedURL;
      // auto-upload if article image not uploaded yet
      if (postType === "article" && image && !uploadedURL) {
        const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        finalImageURL = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        type: postType,
        title: formData.title || "",
        description: postType === "question" ? formData.description || "" : "",
        abstract: postType === "article" ? formData.abstract || "" : "",
        articleText: postType === "article" ? formData.articleText || "" : "",
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        imageURL: finalImageURL || "",
        createdAt: serverTimestamp(),
      });

      setPostDone(true);
      setMessage({ type: "success", text: "✅ Post saved successfully!" });

      // Reset fields
      setFormData({});
      setImage(null);
      setImagePreview("");
      setUploadedURL("");
      setUploadDone(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Save error:", error);
      setMessage({ type: "error", text: "❌ Failed to save post." });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "2em auto" }}>
      <Segment>
        <Label attached="top">New Post</Label>
        <Form.Group inline>
          <label>Select Post Type:</label>
          <Form.Field
            control={Radio}
            label="Question"
            value="question"
            checked={postType === "question"}
            onChange={handlePostTypeChange}
          />
          <Form.Field
            control={Radio}
            label="Article"
            value="article"
            checked={postType === "article"}
            onChange={handlePostTypeChange}
          />
        </Form.Group>
      </Segment>

      <Segment>
        <Label attached="top">What do you want to ask or share?</Label>

        {/* Title */}
        <Form.Field
          control={Input}
          label="Title"
          name="title"
          placeholder={
            postType === "question"
              ? "Start your question with how, what, why..."
              : "Enter a descriptive title"
          }
          value={formData.title || ""}
          onChange={handleChange}
          required
        />

        {/* Fields by type */}
        {postType === "question" ? (
          <Form.Field
            control={TextArea}
            label="Describe your problem"
            name="description"
            placeholder="Describe your problem"
            value={formData.description || ""}
            onChange={handleChange}
            required
          />
        ) : (
          <>
            <Form.Field
              control={TextArea}
              label="Abstract"
              name="abstract"
              placeholder="Enter a 1-paragraph abstract"
              value={formData.abstract || ""}
              onChange={handleChange}
              required
            />
            <Form.Field
              control={TextArea}
              label="Article Text"
              name="articleText"
              placeholder="Write your full article here..."
              value={formData.articleText || ""}
              onChange={handleChange}
              required
            />
            {/* Image Upload */}
            <Form.Field>
              <label>Add an Image</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                >
                  {uploadDone ? "Done" : "Upload"}
                </Button>
              </div>
              {imagePreview && (
                <div style={{ marginTop: "10px" }}>
                  <Image src={imagePreview} size="small" bordered />
                </div>
              )}
            </Form.Field>
          </>
        )}

        {/* Tags */}
        <Form.Field
          control={Input}
          label="Tags"
          name="tags"
          placeholder="e.g. JavaScript, React, Firebase"
          value={formData.tags || ""}
          onChange={handleChange}
        />

        {/* Post Button */}
        <Button
          type="submit"
          color={postDone ? "green" : "blue"}
          loading={posting}
          disabled={posting}
        >
          {postDone ? "Done" : "Post"}
        </Button>

        {/* Feedback */}
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
