![BrainBytes AI](docs/bb_logo.png)
# BrainBytes AI Tutoring Platform

## Overview

BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Technology Stack

- **Frontend**: Next.js
- **Backend**: Node.js
- **Database**: MongoDB (Docker Container)
- **AI Model Integration**: Google Gemini API 
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## Docker Version Information

- **Docker version**: `$(docker --version)`
- **Docker Compose version**: `$(docker-compose --version)`

## Architecture Diagram

![Containerized System Architecture](docs/architecture.png)

This diagram shows:

- Major frontend pages and components
- REST API flow between frontend and backend
- Backend endpoints for auth, profile, messages, and learning materials
- Persistent data storage in MongoDB
- AI model integration via Gemini API
- Docker containers for frontend, backend, and database
- Data flow and service interactions across the stack

## Instructions for Running the Application

<p>This guide explains how to set up and run the BrainBytes AI tutoring platform using Docker containers.</p>

  <h3>1. Prerequisites</h3>
  <p>Before you begin, ensure you have the following installed:</p>
  <ul>
    <li>Docker Desktop (v4.0.0 or higher)</li>
    <li>Git</li>
    <li>Node.js (v16 or higher, for local development only)</li>
  </ul>

  <h3>2. Getting Started</h3>

  <h4>Clone the repository</h4>
  <pre><code>git clone https://github.com/Sempuri/brainbytesAI.git
cd brainbytesAI
git checkout development
</code></pre>

  <h4>Configure environment variables</h4>
  <pre><code>cp .env.example .env
# Edit .env file with your configuration
</code></pre>
  <p>Required variables:</p>
  <ul>
    <li><code>GEMINI_API_KEY</code> (for Google Gemini AI)</li>
    <li><code>JWT_SECRET</code> (for backend authentication)</li>
  </ul>

  <h4>Start the containers</h4>
  <pre><code>docker-compose up -d
</code></pre>

  <h4>Verify the setup</h4>
  <p>You should see all services running with status &ldquo;Up&rdquo;.</p>
  <pre><code>docker-compose ps
</code></pre>

  <h3>3. Access the application</h3>
  <ul>
    <li><strong>Frontend:</strong> <a href="http://localhost:8080">http://localhost:8080</a></li>
    <li><strong>Backend API:</strong> <a href="http://localhost:3000">http://localhost:3000</a></li>
    <li><strong>MongoDB (development):</strong> <code>mongodb://localhost:27017/brainbytes</code></li>
  </ul>

---

## API Documentation for the Endpoints Created

### Messages API

- **Endpoint**: /api/messages
  - **Method**: GET
  - **Description**: Get all chat messages
  - **Request Body**: None
  - **Response**: Array of message objects

- **Endpoint**: /api/messages
  - **Method**: POST
  - **Description**: Create user message and get AI response
  - **Request Body**: `{ "text": "user question" }`
  - **Response**: AI response with metadata

#### Example Response:

```json
{
  "userMessage": { "_id": "123", "text": "What is science?", "isUser ": true, "createdAt": "2023-01-01T00:00:00Z" },
  "aiMessage": { "_id": "456", "text": "Science is...", "isUser ": false, "createdAt": "2023-01-01T00:00:05Z" },
  "category": "science",
  "questionType": "definition",
  "sentiment": "neutral"
}
```

---

<h2>User Authentication &amp; Profile API</h2>

<h3>Register a New User</h3>
<ul>
  <li><strong>Endpoint:</strong> <code>POST /api/auth/register</code></li>
  <li><strong>Description:</strong> Register a new user account.</li>
  <li><strong>Request Body:</strong>
    <pre>{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword",
  "preferredSubjects": ["math", "science"]
}</pre>
  </li>
  <li><strong>Response:</strong>
    <pre>{
  "message": "User registered successfully",
  "token": "&lt;jwt_token&gt;",
  "user": {
    "id": "&lt;user_id&gt;",
    "name": "Your Name",
    "email": "you@example.com",
    "preferredSubjects": ["math", "science"]
  }
}</pre>
  </li>
</ul>

<h3>Login</h3>
<ul>
  <li><strong>Endpoint:</strong> <code>POST /api/auth/login</code></li>
  <li><strong>Description:</strong> Authenticate a user and receive a JWT token.</li>
  <li><strong>Request Body:</strong>
    <pre>{
  "email": "you@example.com",
  "password": "yourpassword"
}</pre>
  </li>
  <li><strong>Response:</strong>
    <pre>{
  "message": "Login successful",
  "token": "&lt;jwt_token&gt;",
  "user": {
    "id": "&lt;user_id&gt;",
    "name": "Your Name",
    "email": "you@example.com",
    "preferredSubjects": ["math", "science"]
  }
}</pre>
  </li>
</ul>

<h3>Get Current User Profile</h3>
<ul>
  <li><strong>Endpoint:</strong> <code>GET /api/auth/profile</code></li>
  <li><strong>Auth Required:</strong> Yes (Bearer token)</li>
  <li><strong>Description:</strong> Get the profile of the currently authenticated user.</li>
  <li><strong>Headers:</strong>
    <pre>Authorization: Bearer &lt;jwt_token&gt;</pre>
  </li>
  <li><strong>Response:</strong>
    <pre>{
  "name": "Your Name",
  "email": "you@example.com",
  "preferredSubjects": ["math", "science"],
  "createdAt": "...",
  "updatedAt": "...",
  "_id": "&lt;user_id&gt;"
}</pre>
  </li>
</ul>

<h3>Update Current User Profile</h3>
<ul>
  <li><strong>Endpoint:</strong> <code>PUT /api/auth/profile</code></li>
  <li><strong>Auth Required:</strong> Yes (Bearer token)</li>
  <li><strong>Description:</strong> Update the profile of the currently authenticated user.</li>
  <li><strong>Headers:</strong>
    <pre>Authorization: Bearer &lt;jwt_token&gt;</pre>
  </li>
  <li><strong>Request Body:</strong>
    <pre>{
  "name": "New Name",
  "preferredSubjects": ["math", "history"]
}</pre>
  </li>
  <li><strong>Response:</strong>
    <pre>{
  "_id": "&lt;user_id&gt;",
  "name": "New Name",
  "email": "you@example.com",
  "preferredSubjects": ["math", "history"],
  "createdAt": "...",
  "updatedAt": "..."
}</pre>
  </li>
</ul>

<p><strong>Note:</strong> All <code>/api/auth/profile</code> endpoints require a valid JWT token in the <code>Authorization</code> header.</p>

---

### Learning Materials API

- **Endpoint**: /api/materials
  - **Method**: GET
  - **Description**: Get all learning materials
  - **Request Body**: None
  - **Response**: Array of material objects

- **Endpoint**: /api/materials
  - **Method**: POST
  - **Description**: Create a new material
  - **Request Body**: Material data
  - **Response**: Created material object

- **Endpoint**: /api/materials/:id
  - **Method**: GET
  - **Description**: Get a specific material
  - **Request Body**: None
  - **Response**: Material object

- **Endpoint**: /api/materials/:id
  - **Method**: PUT
  - **Description**: Update a learning material
  - **Request Body**: Updated material data
  - **Response**: Updated material object

- **Endpoint**: /api/materials/:id
  - **Method**: DELETE
  - **Description**: Delete a learning material
  - **Request Body**: None
  - **Response**: Success message

#### Materials Data Format:

```json
{
  "subject": "math",
  "topic": "Algebra Basics",
  "content": "Algebra is a branch of mathematics..."
}
```

---

## Database Schema Design

We utilized MongoDB with the following collections:

### Messages Collection

```json
{
  "text": String,
  "isUser": Boolean,
  "category": String,
  "questionType": String,
  "sentiment": String,
  "createdAt": Date,
  "userId": ObjectId
}
```

**Purpose**: Stores the conversation history between users and the AI tutor.

### User Profiles Collection

```json
{
  "name": String,
  "email": String,
  "password": String,
  "preferredSubjects": [String],
  "createdAt": Date,
  "updatedAt": Date,
}
```

**Purpose**: Stores user information and learning preferences.

### Learning Materials Collection

```json
{
  "subject": String,
  "topic": String,
  "content": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

**Purpose**: Stores educational content organized by subject and topic.

---

## AI Enhancements Implemented

### Subject Categorization

- Automatically classifies questions into subjects: math, science, history, literature, geography, and language.
- Uses keyword matching and pattern recognition.
- Improves response accuracy by providing subject-specific context.

### Sentiment Analysis

- Provides empathetic responses when negative sentiment is detected.
- Adapts tone to improve user experience.

### Fallback Mechanism

- Provides detailed responses when the API fails.
- Includes subject-specific answers for common questions.
- Handles basic math calculations locally when possible.

### Enhanced API Integration

- Uses Google Gemini's models with optimized prompts.
- Implements timeout handling and error recovery.
- Provides graceful degradation when API is unavailable.

---

## Team Members

- **Rei Emmanuel C** - Team Lead - [lr.recristobal@mmdc.mcl.edu.ph]
- **Kristine E** - Backend Developer - [lr.kencabo@mmdc.mcl.edu.ph]
- **Jodienne E** - Frontend Developer - [lr.jesperas@mmdc.mcl.edu.ph]
- **Vonne Carlo P** - DevOps Engineer - [lr.vcpediengco@mmdc.mcl.edu.ph]
