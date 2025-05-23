import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const { data } = await axios.post("http://localhost:3000/api/auth/login", { email, password });
        // Save token and user to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
        // remove old userId key if present
        localStorage.removeItem("brainbytesUserId");
    } catch (err) {
        setError(err.response?.data?.error || "Login failed");
    } finally {
        setLoading(false);
    }
};

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#eeeeee",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          fontFamily: "Nunito, sans-serif",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href={router.pathname === '/login' ? '/login' : '/'}>
            <a
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#2196f3",
                textDecoration: "none",
              }}
            >
              BrainBytes AI
            </a>
          </Link>
        </div>

        <h1 style={{ color: "#333", marginBottom: "1rem", textAlign: "center" }}>
          Sign In
        </h1>

        {error && (
          <div
            style={{
              color: "#f44336",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              outline: "none",
            }}
            disabled={loading}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••••"
              required
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#2196f3",
                cursor: "pointer",
                fontSize: "14px",
                padding: 0,
                height: "24px",
                lineHeight: "1",
                zIndex: 2,
              }}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: loading ? "#90caf9" : "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
       {/*<div style={{ textAlign: "left", marginTop: "0.6rem", fontSize: "14px" }}>
        <Link href="/forgot-password">
            <a style={{ color: "#2196f3", textDecoration: "none" }}>
            Forgot password?
            </a>
        </Link>
        </div> */}

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "14px" }}>
          New to BrainBytes AI?{' '}
          <Link href="/register">
            <a style={{ color: "#2196f3", textDecoration: "none" }}>
              Create an account
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}