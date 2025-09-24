import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
