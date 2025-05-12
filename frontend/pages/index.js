import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [lastResponse, setLastResponse] = useState({
    category: "",
    questionType: "",
    sentiment: "",
  });
  const messageEndRef = useRef(null);

  const subjects = [
    "all",
    "math",
    "science",
    "history",
    "literature",
    "geography",
    "language",
  ];

  // Fetch user profile if ID exists in localStorage
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("brainbytesUserId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${userId}`
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, []);

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/messages");
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  // Submit a new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsTyping(true); // Show typing indicator
      const userMsg = newMessage;
      setNewMessage("");

      // Optimistically add user message to UI
      const tempUserMsg = {
        _id: Date.now().toString(),
        text: userMsg,
        isUser: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      // Send to backend and get AI response
      const response = await axios.post("http://localhost:3000/api/messages", {
        text: userMsg,
      });

      // Store response metadata
      setLastResponse({
        category: response.data.category || "",
        questionType: response.data.questionType || "",
        sentiment: response.data.sentiment || "",
      });

      // Replace the temporary message with the actual one and add AI response
      setMessages((prev) => {
        // Filter out the temporary message
        const filteredMessages = prev.filter(
          (msg) => msg._id !== tempUserMsg._id
        );
        // Add the real messages from the API
        return [
          ...filteredMessages,
          response.data.userMessage,
          response.data.aiMessage,
        ];
      });
    } catch (error) {
      console.error("Error posting message:", error);
      // Show error in chat
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          text: "Sorry, I couldn't process your request. Please try again later.",
          isUser: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Filter messages by subject category
  const filteredMessages = messages.filter((message) => {
    if (selectedSubject === "all") return true;
    // We can't filter by category directly since it's not stored with messages
    // This is a workaround - in production, you'd store category with each message
    return true;
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Navigation user={user} />

      {user && (
        <div
          style={{
            backgroundColor: "#e3f2fd",
            padding: "10px 15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <p style={{ margin: "0" }}>
            Welcome back, <strong>{user.name}</strong>!
          </p>
        </div>
      )}

      {/* Subject Filter */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ fontSize: "14px", marginBottom: "5px" }}>
          Filter by subject:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  selectedSubject === subject ? "#2196f3" : "#e3f2fd",
                color: selectedSubject === subject ? "white" : "#333",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {subject === "all"
                ? "All Subjects"
                : subject.charAt(0).toUpperCase() + subject.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          height: "500px",
          overflowY: "auto",
          padding: "16px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Loading conversation history...</p>
          </div>
        ) : (
          <div>
            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <h3>Welcome to BrainBytes AI Tutor!</h3>
                <p>Ask me any question about math, science, or history.</p>
              </div>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {filteredMessages.map((message) => (
                  <li
                    key={message._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: message.isUser ? "flex-end" : "flex-start",
                      padding: "12px 16px",
                      margin: "8px 0",
                      backgroundColor: message.isUser ? "#e3f2fd" : "#e8f5e9",
                      color: "#333",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      marginLeft: message.isUser ? "auto" : "0",
                      marginRight: message.isUser ? "0" : "auto",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ margin: "0 0 5px 0", lineHeight: "1.5" }}>
                      {message.text}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        textAlign: message.isUser ? "right" : "left",
                      }}
                    >
                      {message.isUser ? "You" : "AI Tutor"} •{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </li>
                ))}
                {isTyping && (
                  <li
                    style={{
                      padding: "12px 16px",
                      margin: "8px 0",
                      backgroundColor: "#e8f5e9",
                      color: "#333",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      marginLeft: "0",
                      marginRight: "auto",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ margin: "0" }}>AI tutor is typing...</div>
                  </li>
                )}
                <div ref={messageEndRef} />
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Response Metadata Display */}
      {lastResponse.category && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px 15px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          <p style={{ margin: "0" }}>
            Last response - Category: <strong>{lastResponse.category}</strong> |
            Type: <strong>{lastResponse.questionType}</strong> | Sentiment:{" "}
            <strong>{lastResponse.sentiment}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question..."
          style={{
            flex: "1",
            padding: "14px 16px",
            borderRadius: "12px 0 0 12px",
            border: "1px solid #ddd",
            fontSize: "16px",
            outline: "none",
          }}
          disabled={isTyping}
        />
        <button
          type="submit"
          style={{
            padding: "14px 24px",
            backgroundColor: isTyping ? "#90caf9" : "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "0 12px 12px 0",
            fontSize: "16px",
            cursor: isTyping ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
          disabled={isTyping}
        >
          {isTyping ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

// Note: Make sure to run the backend server on port 3000 for this to work.
// You can change the API URL in the axios calls if your backend is running on a different port or domain.
