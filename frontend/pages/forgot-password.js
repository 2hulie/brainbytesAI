import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email,
      });
      setMessage(
        "If this email is registered, a password reset link has been sent.",
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <h2 style={{ fontFamily: "Nunito, sans-serif", color: "#333" }}>
        Forgot Password
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            fontFamily: "Nunito, sans-serif",
          }}
        />
        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 8,
            background: "#2196f3",
            color: "#fff",
            border: "none",
            fontFamily: "Nunito, sans-serif",
            fontSize: "16px",
          }}
        >
          Send Reset Link
        </button>
      </form>
      {message && (
        <div
          style={{
            color: "green",
            marginTop: 16,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {message}
        </div>
      )}
      {error && (
        <div
          style={{
            color: "red",
            marginTop: 16,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {error}
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <Link href="/login">
          <a
            style={{
              fontFamily: "Nunito, sans-serif",
              color: "#2196f3",
              textDecoration: "none",
            }}
          >
            Back to login
          </a>
        </Link>
      </div>
    </div>
  );
}
