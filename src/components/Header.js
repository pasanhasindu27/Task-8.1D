import React, { useState, useEffect } from "react";
import { Menu, Button, Input } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Menu inverted fixed="top" style={{ padding: "0.8em" }}>
      {/* ✅ Logo / Home */}
      <Menu.Item header onClick={() => navigate("/")} style={{ fontWeight: "bold", fontSize: "1.2em" }}>
        DEV@Deakin
      </Menu.Item>

      {/* ✅ Search bar */}
      <Menu.Item style={{ flex: 1 }}>
        <Input
          icon="search"
          placeholder="Search posts or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fluid
        />
      </Menu.Item>

      {/* ✅ Right Menu */}
      <Menu.Menu position="right">
        <Menu.Item>
          <Button color="blue" onClick={() => navigate("/PostForm")}>
            PostForm
          </Button>
        </Menu.Item>
         <Menu.Item>
             <Button color="green" onClick={() => navigate("/find-questions")}>
             Find Questions
             </Button>
        </Menu.Item>

        <Menu.Item>
          {user ? (
            <Button color="red" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="teal" onClick={() => navigate("/login")}>
              Login
            </Button>
          
          )}
        </Menu.Item>
       

      </Menu.Menu>
    </Menu>
  );
}
