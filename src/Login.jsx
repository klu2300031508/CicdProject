import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/home";

  // Draw Captcha
  const drawCaptcha = useCallback((text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = `hsl(${Math.random() * 360}, 30%, 92%)`;
    ctx.fillRect(0, 0, width, height);

    // Noise
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 40%, 0.6)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Characters
    const charCount = text.length;
    const baseX = 20;
    const stepX = (width - 40) / charCount;

    for (let i = 0; i < charCount; i++) {
      const c = text[i];
      const size = 24 + Math.random() * 8;
      ctx.save();
      ctx.font = `${size}px sans-serif`;
      ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 35%)`;
      const angle = (Math.random() - 0.5) * 0.6;
      const x = baseX + i * stepX + (Math.random() - 0.5) * 6;
      const y = height / 2 + (Math.random() - 0.5) * 12;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(c, 0, 0);
      ctx.restore();
    }

    // Dots
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 30%, 0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Generate captcha
  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let r = "";
    for (let i = 0; i < 6; i++) {
      r += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(r);
    setUserInput("");
    setError("");
    setTimeout(() => drawCaptcha(r), 0);
  }, [drawCaptcha]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate captcha
    if (userInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError("Invalid Captcha");
      generateCaptcha();
      setIsLoading(false);
      return;
    }

    // Call backend API
    try {
      const res = await axios.post("http://localhost:8081/auth/login", form);
      const payload = res.data || {};
      const token = typeof payload === "string" ? payload : payload.token;
      const email = payload.email || null;

      login({ username: form.username, email, token });
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid username or password";
      setError(message);
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>Welcome Back</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="captcha-container">
            <label htmlFor="captcha-input">Security Check</label>
          <div className="captcha-wrapper">
            <canvas ref={canvasRef} width={240} height={70} />
            <button type="button" className="captcha-refresh" onClick={generateCaptcha}>
              🔄
            </button>
          </div>

          <input
              id="captcha-input"
            type="text"
            placeholder="Enter Captcha"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          New user?{" "}
          <Link to="/signup" style={{ textDecoration: "underline" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
