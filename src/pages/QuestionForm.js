import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';

export default function QuestionForm() {
  return (
    <>
      <Form.Field>
        <label>Title</label>
        <input placeholder="Enter your question title" />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <TextArea placeholder="Describe your question..." />
      </Form.Field>
      <Form.Field>
        <label>Tags</label>
        <input placeholder="e.g. JavaScript, React" />
      </Form.Field>
    </>
  );
}
