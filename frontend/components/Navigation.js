import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation({ user }) {
  const router = useRouter();

  // Helper function to determine if a link is active
  const isActive = (path) => router.pathname === path;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        marginBottom: "20px",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "22px" }}>
        <Link href="/">
          <a style={{ textDecoration: "none", color: "#2196f3" }}>
            BrainBytes AI
          </a>
        </Link>
      </div>

      <div>
        <Link href="/">
          <a
            style={{
              padding: "8px 16px",
              color: router.pathname === "/" ? "#2196f3" : "#666",
              fontWeight: router.pathname === "/" ? "bold" : "normal",
              textDecoration: "none",
              marginRight: "15px",
              borderBottom: isActive("/") ? "2px solid #2196f3" : "none",
            }}
          >
            Chat
          </a>
        </Link>

        <Link href="/dashboard">
          <a
            style={{
              padding: "8px 16px",
              color: isActive("/dashboard") ? "#2196f3" : "#666",
              fontWeight: isActive("/dashboard") ? "bold" : "normal",
              textDecoration: "none",
              marginRight: "15px",
              borderBottom: isActive("/dashboard")
                ? "2px solid #2196f3"
                : "none",
            }}
          >
            Dashboard
          </a>
        </Link>

        <Link href="/profile">
          <a
            style={{
              padding: "8px 16px",
              backgroundColor: isActive("/profile") ? "#1976d2" : "#2196f3",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              transition: "background-color 0.2s",
            }}
          >
            Profile
          </a>
        </Link>
      </div>
    </nav>
  );
}
