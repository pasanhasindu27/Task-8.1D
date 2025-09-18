import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Header,
  Container,
  Dropdown,
  Icon,
} from "semantic-ui-react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export default function FindQuestions() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortByDate, setSortByDate] = useState("desc");
  const [expanded, setExpanded] = useState(null);

  // ✅ Live fetch questions from Firestore (updates instantly when new added)
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((q) => q.type === "question"); // only keep questions
      setQuestions(data);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Filter logic
  const filteredQuestions = questions
    .filter((q) =>
      q.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((q) =>
      tagFilter ? q.tags?.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase())) : true
    )
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return sortByDate === "asc"
        ? a.createdAt.seconds - b.createdAt.seconds
        : b.createdAt.seconds - a.createdAt.seconds;
    });

  // ✅ Delete question
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  // ✅ Expand / collapse details
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Container style={{ marginTop: "2em" }}>
      <Header as="h2">Find Questions</Header>

      {/* ✅ Filters */}
      <div style={{ marginBottom: "1em", display: "flex", gap: "1em" }}>
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          placeholder="Filter by tag..."
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <Dropdown
          selection
          options={[
            { key: "desc", text: "Newest First", value: "desc" },
            { key: "asc", text: "Oldest First", value: "asc" },
          ]}
          value={sortByDate}
          onChange={(e, { value }) => setSortByDate(value)}
        />
      </div>

      {/* ✅ Question Cards */}
      <Card.Group>
        {filteredQuestions.map((q) => (
          <Card key={q.id} fluid>
            <Card.Content onClick={() => toggleExpand(q.id)}>
              <Card.Header>{q.title}</Card.Header>
              <Card.Meta>
                {q.tags?.join(", ")} |{" "}
                {q.createdAt?.toDate().toLocaleDateString()}
              </Card.Meta>
              <Card.Description>
                {expanded === q.id
                  ? q.description || "No description provided"
                  : (q.description || "").slice(0, 100) + "..."}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button
                color="red"
                size="tiny"
                onClick={() => handleDelete(q.id)}
              >
                <Icon name="trash" /> Delete
              </Button>
              <Button
                color="blue"
                size="tiny"
                onClick={() => toggleExpand(q.id)}
              >
                {expanded === q.id ? "Collapse" : "Expand"}
              </Button>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  );
}
