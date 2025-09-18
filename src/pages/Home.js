import React, { useEffect, useState } from "react";
import { Container, Button } from "semantic-ui-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FeaturedArticles from "../components/FeaturedArticles";
import Tutorials from "../components/Tutorials";
import GPTAssistant from "../components/GPTAssistant"; // 👈 Add this line

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />

      <Container style={{ marginTop: "2em", marginBottom: "2em" }}>
        {user && (
          <div style={{ textAlign: "center", marginBottom: "2em" }}>
            <h3>Welcome, {user.email}</h3>
          </div>
        )}

        <FeaturedArticles />
        <div style={{ textAlign: "center", margin: "1em" }}>
          <Button primary>See all articles</Button>
        </div>

        <Tutorials />
        <div style={{ textAlign: "center", margin: "1em" }}>
          <Button primary>See all tutorials</Button>
        </div>

        {/* ✅ GPT Assistant Section */}
        <GPTAssistant />
      </Container>

      <Footer />
    </>
  );
}
