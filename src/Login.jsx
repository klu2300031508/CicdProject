import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // background
    ctx.fillStyle = `hsl(${Math.random() * 360}, 30%, 92%)`;
    ctx.fillRect(0, 0, width, height);

    // random lines for noise
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 40%, 0.6)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // draw characters with jitter
    const charCount = text.length;
    const baseX = 20;
    const stepX = (width - 40) / charCount;
    for (let i = 0; i < charCount; i++) {
      const char = text[i];
      const fontSize = 24 + Math.floor(Math.random() * 8);
      ctx.save();
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 35%)`;
      const angle = (Math.random() - 0.5) * 0.6; // ~ -17° to 17°
      const x = baseX + i * stepX + (Math.random() - 0.5) * 6;
      const y = height / 2 + (Math.random() - 0.5) * 12;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // sprinkle dots
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 30%, 0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setError("");
    // draw immediately with the new text value
    setTimeout(() => drawCaptcha(result), 0);
  };

  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate captcha
    if (userInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError("Invalid captcha. Please try again.");
      generateCaptcha();
      setIsLoading(false);
      return;
    }

    // Simulate login process
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      login(email);
      navigate("/home");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          
          <div className="captcha-container">
            <label htmlFor="captcha">Security Verification</label>
            <div className="captcha-wrapper">
              <canvas
                ref={canvasRef}
                width={240}
                height={70}
                style={{ borderRadius: 8, background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }}
              />
              <button 
                type="button" 
                className="captcha-refresh"
                onClick={generateCaptcha}
                title="Refresh captcha"
              >
                🔄
              </button>
            </div>
            <input
              id="captcha"
              type="text"
              placeholder="Enter the text above"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
