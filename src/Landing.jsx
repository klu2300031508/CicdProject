import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <h1>Welcome to News Aggregator</h1>
      <p>Stay updated with the latest news across categories.</p>
      <Link to="/home" className="btn">Get Started</Link>
    </div>
  );
}

export default Landing;
