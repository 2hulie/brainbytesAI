import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    byCategory: {},
    byQuestionType: {},
    sentiment: { positive: 0, neutral: 0, negative: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem("brainbytesUserId");

        // Fetch user profile if ID exists
        if (userId) {
          const userResponse = await axios.get(
            `http://localhost:3000/api/users/${userId}`
          );
          setUser(userResponse.data);
        }

        // Fetch messages
        const messagesResponse = await axios.get(
          "http://localhost:3000/api/messages"
        );
        setMessages(messagesResponse.data);

        // Fetch learning materials
        const materialsResponse = await axios.get(
          "http://localhost:3000/api/materials"
        );
        setMaterials(materialsResponse.data);

        // Process user message stats (from the messages array)
        analyzeMessages(messagesResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Analyze messages for statistics
  const analyzeMessages = (msgs) => {
    // Filter only user questions
    const userQuestions = msgs.filter((msg) => msg.isUser);

    // Get corresponding AI responses
    const aiResponses = msgs.filter((msg) => !msg.isUser);

    // Calculate stats
    const totalQuestions = userQuestions.length;
    const byCategory = {};
    const byQuestionType = {};
    const sentiment = { positive: 0, neutral: 0, negative: 0 };

    // This is a simplified analysis since we don't store category/type with messages
    // In a real implementation, we would store this data with each message
    userQuestions.forEach((question, index) => {
      // For demonstration, we'll assign random categories and types
      // In reality, this would come from your API responses
      const categories = [
        "math",
        "science",
        "history",
        "geography",
        "literature",
        "language",
      ];
      const types = ["definition", "explanation", "example", "calculation"];
      const sentiments = ["positive", "neutral", "negative"];

      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomSentiment =
        sentiments[Math.floor(Math.random() * sentiments.length)];

      // Update stats
      byCategory[randomCategory] = (byCategory[randomCategory] || 0) + 1;
      byQuestionType[randomType] = (byQuestionType[randomType] || 0) + 1;
      sentiment[randomSentiment] = sentiment[randomSentiment] + 1;
    });

    setStats({
      totalQuestions,
      byCategory,
      byQuestionType,
      sentiment,
    });
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Navigation user={user} />

      <h1 style={{ color: "#333", marginBottom: "20px" }}>
        Learning Dashboard
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div>
          {/* User Welcome Section */}
          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2>Welcome, {user ? user.name : "Guest"}!</h2>
            {user ? (
              <p>
                Your preferred subjects:{" "}
                {user.preferredSubjects.length > 0
                  ? user.preferredSubjects
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(", ")
                  : "None selected"}
              </p>
            ) : (
              <p>
                Please{" "}
                <Link href="/profile">
                  <a style={{ color: "#2196f3" }}>create a profile</a>
                </Link>{" "}
                to customize your learning experience.
              </p>
            )}
          </div>

          {/* Learning Stats Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Total Questions Card */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Questions Asked</h3>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#2196f3",
                }}
              >
                {stats.totalQuestions}
              </p>
            </div>

            {/* Questions by Category */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Top Subject</h3>
              {Object.entries(stats.byCategory).length > 0 ? (
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ff9800",
                  }}
                >
                  {Object.entries(stats.byCategory)
                    .sort((a, b) => b[1] - a[1])[0][0]
                    .charAt(0)
                    .toUpperCase() +
                    Object.entries(stats.byCategory)
                      .sort((a, b) => b[1] - a[1])[0][0]
                      .slice(1)}
                </p>
              ) : (
                <p>No data yet</p>
              )}
            </div>

            {/* Sentiment Analysis */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Sentiment Analysis</h3>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#4caf50",
                    }}
                  >
                    {stats.sentiment.positive}
                  </div>
                  <div>Positive</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#9e9e9e",
                    }}
                  >
                    {stats.sentiment.neutral}
                  </div>
                  <div>Neutral</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#f44336",
                    }}
                  >
                    {stats.sentiment.negative}
                  </div>
                  <div>Negative</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <h2 style={{ color: "#333" }}>Recent Activity</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Recent Questions */}
            <div>
              <h3>Recent Questions</h3>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  height: "300px",
                  overflow: "auto",
                  padding: "10px",
                }}
              >
                {messages
                  .filter((msg) => msg.isUser)
                  .slice(-10)
                  .reverse()
                  .map((message) => (
                    <div
                      key={message._id}
                      style={{
                        padding: "10px",
                        margin: "5px 0",
                        backgroundColor: "#e3f2fd",
                        borderRadius: "8px",
                      }}
                    >
                      <div>{message.text}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "5px",
                        }}
                      >
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                {messages.filter((msg) => msg.isUser).length === 0 && (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    No questions yet
                  </p>
                )}
              </div>
            </div>

            {/* Learning Materials */}
            <div>
              <h3>Available Learning Materials</h3>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  height: "300px",
                  overflow: "auto",
                  padding: "10px",
                }}
              >
                {materials.map((material) => (
                  <div
                    key={material._id}
                    style={{
                      padding: "10px",
                      margin: "5px 0",
                      backgroundColor: "#e8f5e9",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{material.topic}</div>
                    <div style={{ fontSize: "14px", marginTop: "5px" }}>
                      Subject:{" "}
                      {material.subject.charAt(0).toUpperCase() +
                        material.subject.slice(1)}
                    </div>
                  </div>
                ))}
                {materials.length === 0 && (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    No learning materials yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
