
import React, { useState } from "react";
import { Segment, Header, Form, TextArea, Button, Message, Icon } from "semantic-ui-react";
import axios from "axios";

export default function GPTAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const handleAsk = async () => {
    if (!prompt.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/ask`, { prompt });
      if (res.data.success) {
        setResponse(res.data.reply);
      } else {
        setError("The assistant could not generate a response.");
      }
    } catch (err) {
      console.error("❌ GPT API Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment style={{ marginTop: "2em" }}>
      <Header as="h3">
        <Icon name="robot" />
        GPT Assistant
      </Header>
      <Form>
        <TextArea
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <Button
          primary
          style={{ marginTop: "1em" }}
          onClick={handleAsk}
          loading={loading}
        >
          Ask
        </Button>
      </Form>

      {response && (
        <Message positive style={{ marginTop: "1em" }}>
          <Message.Header>Response</Message.Header>
          <p>{response}</p>
        </Message>
      )}

      {error && (
        <Message negative style={{ marginTop: "1em" }}>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
    </Segment>
  );
}
