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
