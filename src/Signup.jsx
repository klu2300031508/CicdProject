import React, { useState } from "react";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signup successful for ${email}`);
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <h1>Join Us Today</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
