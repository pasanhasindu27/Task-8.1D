import React, { useState, useEffect } from "react";
import { Button, Form, Message, Segment } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEmail("");
      setPassword("");
      navigate("/login"); // refreshes back to login form
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // ✅ If already logged in → show sign out option
  if (user) {
    return (
      <Segment padded="very" style={{ maxWidth: 400, margin: "3em auto", textAlign: "center" }}>
        <h3>You are signed in as <strong>{user.email}</strong></h3>
        <Button color="red" fluid onClick={handleLogout}>
          Sign out
        </Button>
      </Segment>
    );
  }

  // Otherwise → show login form
  return (
    <Segment padded="very" style={{ maxWidth: 400, margin: "3em auto" }}>
      <Form onSubmit={handleLogin} error={!!error}>
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
        <Button primary fluid type="submit">Login</Button>
        <Message error content={error} />
      </Form>
      <Message>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </Message>
    </Segment>
  );
}
