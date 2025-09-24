import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <h1>Welcome to News Aggregator</h1>
      <p>Stay updated with the latest news across categories.</p>
      <div className="landing-cta">
        <Link to="/home" className="btn">Get Started</Link>
        <div className="cta-auth">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-secondary">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
