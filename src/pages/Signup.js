import React, { useState } from "react";
import { Button, Form, Message, Segment } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email
      });

      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Segment padded="very" style={{ maxWidth: 400, margin: "3em auto" }}>
      <Form onSubmit={handleSignup} error={!!error}>
        <Form.Input
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Form.Input
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Form.Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Form.Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button primary fluid type="submit">Sign Up</Button>
        <Message error content={error} />
      </Form>
      <Message>
        Already have an account? <Link to="/">Login here</Link>
      </Message>
    </Segment>
  );
}
