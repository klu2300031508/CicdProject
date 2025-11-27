import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const res = await axios.post("http://localhost:8081/auth/signup", payload);

      setSuccess(res.data?.message || "Account created successfully!");
      setForm(initialForm);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed — username or email may already exist.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <h1>Create Account</h1>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Enter Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />

          {error && <div className="form-feedback error">{error}</div>}
          {success && <div className="form-feedback success">{success}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "underline" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
