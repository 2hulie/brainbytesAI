# BrainBytes AI Tutoring Platform

## Project Overview
BrainBytes is an AI-powered tutoring platform designed to provide accessible academic
assistance to Filipino students. This project implements the platform using modern DevOps
practices and containerization.

## Team Members
- Rei Emmanuel C - Team Lead - [lr.recristobal@mmdc.mcl.edu.ph]
- Kristine E - Backend Developer - [lr.kencabo@mmdc.mcl.edu.ph]
- Jodienne E - Frontend Developer - [lr.jesperas@mmdc.mcl.edu.ph]
- Vonne Carlo P  - DevOps Engineer - [lr.vcpediengco@mmdc.mcl.edu.ph]

## Project Goals
- Implement a containerized application with proper networking
- Create an automated CI/CD pipeline using GitHub Actions
- Deploy the application to Oracle Cloud Free Tier
- Set up monitoring and observability tools

## Technology Stack
- Frontend: Next.js
- Backend: Node.js
- Database: MongoDB Atlas
- Containerization: Docker
- CI/CD: GitHub Actions
- Cloud Provider: Oracle Cloud Free Tier
- Monitoring: Prometheus & Grafana

## Development Environment Setup Verification
| Team Member      | Docker Installed | Git Installed | VS Code Installed | Can Run Hello World Container |
|------------------|------------------|---------------|-------------------|--------------------------------|
| Rei           | ✓                | ✓             | ✓                 | ✓                              |
| Vonne           | ✓                | ✓             | ✓                 | ✓                              |
| Kristine           | ✓                | ✓             | ✓                 | ✓                              |
| Jodienne           | ✓                | ✓             | ✓                 | ✓                              |

## Docker Version Information
- Docker version: `$(docker --version)`
- Docker Compose version: `$(docker-compose --version)`

## Architecture Diagram

![Containerized System Architecture](docs/architecture.png)

This diagram shows:
- Container names and port mappings
- Data flow between components
- AI model integration service

## Task Distribution Plan (Milestone 1)
### Week 1: Container Basics
- **Jodienne E**: Set up project repository and basic documentation  
- **Rei Emmanuel C**: Research and document containerization approach  
- **All Team Members**: Complete Docker installation and verification

### Week 2: Platform Development
- **Jodienne E**: Implement frontend container (Next.js)  
- **Kristine E**: Implement backend container (Node.js)  
- **Rei Emmanuel C**: Configure MongoDB Atlas and connection

### Week 3: Platform Development (continued)
- **Jodienne E**: Implement chat interface frontend  
- **Kristine E**: Implement backend API endpoints  
- **Vonne Carlo P**: Set up container networking

### Week 4: Integration and Testing
- **Kristine E**: Integrate AI model  
- **Vonne Carlo P**: Implement message history storage  
- **Rei Emmanuel C**: Create project documentation  
- **All Team Members**: Final testing and preparation for submission

## Documentation

- [Full Platform Documentation](docs/Documentations.md)

### tab Full-Platform-Documentation

# BrainBytes AI Chat Platform Documentation

## Instructions for Running the Application

1. Download the zip file of the repository

2. Extract the zip file

3. Open Command Prompt or PowerShell

4. Navigate to the project directory:

   ```bash
   cd brainbytes-multi-container
   ```

5. Open Docker Desktop (install it if you haven't already)

6. In the terminal, still in the `brainbytes-multi-container` directory, run:

   ```bash
   docker-compose build
   ```

   The terminal should show the build process output.

7. Then, run:

   ```bash
   docker-compose up
   ```

   The application will start running.

8. Open a web browser and go to:

   ```
   http://localhost:8080/
   ```

   You should see the application interface.

---

## API Documentation for the Endpoints Created

### Messages API

| Endpoint      | Method | Description                             | Request Body                  | Response                  |
| ------------- | ------ | --------------------------------------- | ----------------------------- | ------------------------- |
| /api/messages | GET    | Get all chat messages                   | None                          | Array of message objects  |
| /api/messages | POST   | Create user message and get AI response | `{ "text": "user question" }` | AI response with metadata |

#### Example Response:

```json
{
  "userMessage": { "_id": "123", "text": "What is science?", "isUser": true, "createdAt": "2023-01-01T00:00:00Z" },
  "aiMessage": { "_id": "456", "text": "Science is...", "isUser": false, "createdAt": "2023-01-01T00:00:05Z" },
  "category": "science",
  "questionType": "definition",
  "sentiment": "neutral"
}
```

---

### User Profiles API

| Endpoint        | Method | Description               | Request Body      | Response              |
| --------------- | ------ | ------------------------- | ----------------- | --------------------- |
| /api/users      | GET    | Get all user profiles     | None              | Array of user objects |
| /api/users      | POST   | Create a new user profile | User data         | Created user object   |
| /api/users/\:id | GET    | Get a specific user       | None              | User object           |
| /api/users/\:id | PUT    | Update a user profile     | Updated user data | Updated user object   |
| /api/users/\:id | DELETE | Delete a user profile     | None              | Success message       |

#### User Data Format:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "preferredSubjects": ["math", "science"]
}
```

---

### Learning Materials API

| Endpoint            | Method | Description                | Request Body          | Response                  |
| ------------------- | ------ | -------------------------- | --------------------- | ------------------------- |
| /api/materials      | GET    | Get all learning materials | None                  | Array of material objects |
| /api/materials      | POST   | Create a new material      | Material data         | Created material object   |
| /api/materials/\:id | GET    | Get a specific material    | None                  | Material object           |
| /api/materials/\:id | PUT    | Update a learning material | Updated material data | Updated material object   |
| /api/materials/\:id | DELETE | Delete a learning material | None                  | Success message           |

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
  "createdAt": Date
}
```

**Purpose**: Stores the conversation history between users and the AI tutor.

### User Profiles Collection

```json
{
  "name": String,
  "email": String,
  "preferredSubjects": [String],
  "createdAt": Date,
  "updatedAt": Date
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

* Automatically classifies questions into subjects: math, science, history, literature, geography, and language
* Uses keyword matching and pattern recognition
* Improves response accuracy by providing subject-specific context

### Question Type Detection

* Identifies question types: definitions, explanations, examples, and calculations
* Formats responses appropriately based on question type
* Customizes API prompts for better answers

### Sentiment Analysis

* Detects user frustration or confusion through keyword analysis
* Provides empathetic responses when negative sentiment is detected
* Adapts tone to improve user experience

### Fallback Mechanism

* Provides detailed responses when the API fails
* Includes subject-specific answers for common questions
* Handles basic math calculations locally when possible

### Enhanced API Integration

* Uses Hugging Face's models with optimized prompts
* Implements timeout handling and error recovery
* Provides graceful degradation when API is unavailable

