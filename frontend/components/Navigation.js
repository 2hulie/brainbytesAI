import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
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
        <Link href="/" style={{ textDecoration: "none", color: "#2196f3" }}>
          BrainBytes AI
        </Link>
      </div>

      <div>
        <Link
          href="/"
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
        </Link>

        <Link
          href="/dashboard"
          style={{
            padding: "8px 16px",
            color: isActive("/dashboard") ? "#2196f3" : "#666",
            fontWeight: isActive("/dashboard") ? "bold" : "normal",
            textDecoration: "none",
            marginRight: "15px",
            borderBottom: isActive("/dashboard") ? "2px solid #2196f3" : "none",
          }}
        >
          Dashboard
        </Link>

        <Link
          href="/profile"
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
        </Link>
      </div>
    </nav>
  );
}
