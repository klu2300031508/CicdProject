import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.username || user?.email || "Signed in";
  const initials = (displayName || "?")
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <nav className="navbar">
      <h1 className="logo">News Aggregator</h1>
      <ul className="nav-links">
        <li><Link to="/">Landing</Link></li>
        {user ? (
          // Show all options when logged in
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/category/technology">Technology</Link></li>
            <li><Link to="/category/sports">Sports</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li className="nav-profile-section">
              <Link to="/profile" className="profile-chip">
                <span className="profile-avatar-small">{initials}</span>
                <span className="profile-names">
                  <strong>{displayName}</strong>
                  <small>View profile</small>
                </span>
              </Link>
              <button className="btn-cta btn-outline" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          // Show only login/signup when not logged in
          <>
            <li><Link className="btn-cta btn-outline" to="/login">Login</Link></li>
            <li><Link className="btn-cta btn-primary" to="/signup">Sign up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
