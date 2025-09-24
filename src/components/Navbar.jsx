import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">News Aggregator</h1>
      <ul className="nav-links">
        <li><Link to="/">Landing</Link></li>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/category/technology">Technology</Link></li>
        <li><Link to="/category/sports">Sports</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
