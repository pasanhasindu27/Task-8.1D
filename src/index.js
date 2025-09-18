/* eslint-disable react/jsx-pascal-case */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PostForm from "./pages/PostForm";  
import FindQuestions from "./pages/FindQuestions";
import 'semantic-ui-css/semantic.min.css';


import "semantic-ui-css/semantic.min.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      {/* ✅ Default page loads Home */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* ✅ Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Post page */}
      <Route path="/postform" element={<PostForm />} /> 

      {/* ✅ Find Questions page */}
      <Route path="/find-questions" element={<FindQuestions />} /> 

      

      
    </Routes>
  </Router>
);
