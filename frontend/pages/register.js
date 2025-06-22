import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../utils/api";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      // Save token and user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <Link href="/" style={styles.logo}>
            BrainBytes AI
          </Link>
        </div>

        <h1 style={styles.heading}>Create Account</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            style={styles.input}
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={styles.input}
            disabled={loading}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            style={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: loading ? "#90caf9" : "#2196f3",
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// Styling
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#eeeeee",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "20px",
    fontFamily: "Nunito, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2196f3",
    textDecoration: "none",
  },
  heading: {
    color: "#333",
    marginBottom: "1rem",
    textAlign: "center",
  },
  error: {
    color: "#f44336",
    backgroundColor: "#ffebee",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "14px",
  },
  link: {
    color: "#2196f3",
    textDecoration: "none",
  },
};
