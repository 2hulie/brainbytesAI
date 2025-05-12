import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    preferredSubjects: [],
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [isNewUser, setIsNewUser] = useState(true);

  const subjectOptions = [
    "math",
    "science",
    "history",
    "literature",
    "geography",
    "language",
  ];

  // Load user profile or get all users if no ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get stored user ID from localStorage
        const storedUserId = localStorage.getItem("brainbytesUserId");

        if (storedUserId) {
          setUserId(storedUserId);
          setIsNewUser(false);
          const response = await axios.get(
            `http://localhost:3000/api/users/${storedUserId}`
          );
          setUser(response.data);
        } else {
          // If no stored user, get all users for selection
          const response = await axios.get("http://localhost:3000/api/users");
          setAllUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ text: "Failed to load profile data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubjectChange = (subject) => {
    const updatedSubjects = [...user.preferredSubjects];

    if (updatedSubjects.includes(subject)) {
      // Remove subject if already selected
      const index = updatedSubjects.indexOf(subject);
      updatedSubjects.splice(index, 1);
    } else {
      // Add subject if not selected
      updatedSubjects.push(subject);
    }

    setUser({ ...user, preferredSubjects: updatedSubjects });
  };

  const handleSelectUser = (selectedUserId) => {
    localStorage.setItem("brainbytesUserId", selectedUserId);
    setUserId(selectedUserId);
    setIsNewUser(false);
    router.reload(); // Reload to fetch the selected user's data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      let response;

      if (isNewUser) {
        // Create new user
        response = await axios.post("http://localhost:3000/api/users", user);
        localStorage.setItem("brainbytesUserId", response.data._id);
        setUserId(response.data._id);
        setIsNewUser(false);
        setMessage({ text: "Profile created successfully!", type: "success" });
      } else {
        // Update existing user
        response = await axios.put(
          `http://localhost:3000/api/users/${userId}`,
          user
        );
        setMessage({ text: "Profile updated successfully!", type: "success" });
      }

      setUser(response.data);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        text: error.response?.data?.error || "Failed to save profile",
        type: "error",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Navigation user={user.name ? user : null} />

      <h1 style={{ color: "#333", marginBottom: "20px" }}>User Profile</h1>

      {message.text && (
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            backgroundColor: message.type === "error" ? "#ffebee" : "#e8f5e9",
            color: message.type === "error" ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
          }}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading user data...</p>
        </div>
      ) : (
        <>
          {!userId && allUsers.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2>Select Existing Profile</h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {allUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser(user._id)}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#bbdefb")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e3f2fd")
                    }
                  >
                    {user.name} ({user.email})
                  </div>
                ))}
              </div>
              <div style={{ margin: "15px 0" }}>
                <p>Or create a new profile below:</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                Preferred Subjects:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {subjectOptions.map((subject) => (
                  <div
                    key={subject}
                    onClick={() => handleSubjectChange(subject)}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: user.preferredSubjects.includes(subject)
                        ? "#2196f3"
                        : "#e3f2fd",
                      color: user.preferredSubjects.includes(subject)
                        ? "white"
                        : "#333",
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              {isNewUser ? "Create Profile" : "Update Profile"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
