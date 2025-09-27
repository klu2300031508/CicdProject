import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <h1>Welcome to News Aggregator</h1>
      <p>Stay updated with the latest news across categories.</p>
      <div className="landing-actions" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/home" className="btn">Get Started</Link>
        <Link to="/login" className="btn" style={{ background: "#1e88e5" }}>Login</Link>
        <Link to="/signup" className="btn" style={{ background: "#43a047" }}>Signup</Link>
      </div>
    </div>
  );
}

export default Landing;
