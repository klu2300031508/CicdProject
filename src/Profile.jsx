import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const initials = (user.username || user.email || "?")
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <section className="profile">
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <h2>{user.username || user.email}</h2>
          {user.email && user.username && <p>{user.email}</p>}
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/home")} className="profile-btn ghost">
            Go to Home
          </button>
          <button onClick={handleLogout} className="profile-btn danger">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}


