# CodeSentinel

## AI-Powered Code Security & Vulnerability Scanner

[![Status Badge](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)](https://github.com/farhannaeem00/codesentinel)
[![Version Badge](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/farhannaeem00/codesentinel/releases)
[![License Badge](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Open Source Badge](https://img.shields.io/badge/Open%20Source-Yes-success?style=for-the-badge)](https://github.com/farhannaeem00/codesentinel)

### Tech Stack

[![React Badge](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Python Badge](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI Badge](https://img.shields.io/badge/FastAPI-0.100-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB Badge](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Groq Badge](https://img.shields.io/badge/Groq-LLaMA3-8B5CF6?style=for-the-badge)](https://groq.com)
[![GitHub Badge](https://img.shields.io/badge/GitHub-API-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/api)
[![Tailwind Badge](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vercel Badge](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

### Quick Links

[GitHub Repository](https://github.com/farhannaeem00/codesentinel) | [Report Bug](https://github.com/farhannaeem00/codesentinel/issues) | [Discussions](https://github.com/farhannaeem00/codesentinel/discussions)

---

> **Paste a GitHub repo URL. Get an instant AI-powered security audit. Find vulnerabilities before hackers do.**

---

## Executive Summary

CodeSentinel is a full-stack, production-grade security analysis platform that provides automated vulnerability detection and risk assessment for public GitHub repositories. Leveraging advanced AI models (Groq LLaMA3-70B), the platform delivers comprehensive security audits in under 2 minutes, identifying critical vulnerabilities, security misconfigurations, and code quality issues across 15+ programming languages.

### Key Value Proposition

- Instant, enterprise-grade security audits at zero infrastructure cost
- AI-powered analysis covering 10+ vulnerability classes
- Actionable remediation guidance with code examples
- Professional security dashboard with real-time risk scoring

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Architecture](#solution-architecture)
3. [Features Overview](#features-overview)
4. [Technology Stack](#technology-stack)
5. [System Design](#system-design)
6. [Project Structure](#project-structure)
7. [Installation & Setup](#installation--setup)
8. [API Documentation](#api-documentation)
9. [Deployment Guide](#deployment-guide)
10. [Contributing Guidelines](#contributing-guidelines)
11. [License](#license)

---

## Problem Statement

### Security Landscape Challenges

| Challenge | Impact | Current Gap |
|-----------|--------|------------|
| Vulnerability Prevalence | 68% of applications contain security vulnerabilities | Manual audits are cost-prohibitive |
| Breach Cost | $4.45M average cost per data breach | Early detection is critical |
| Audit Expense | $10,000–$50,000 per professional audit | Small organizations lack access |
| Resource Constraint | Most development teams lack security expertise | Automated screening is essential |
| Common Oversights | SQL injection, exposed credentials, XSS, unsafe dependencies | Systematic detection needed |

### Vulnerability Types Commonly Missed

- SQL injection in database queries
- Hardcoded API keys and credentials
- Cross-Site Scripting (XSS) vulnerabilities
- Insecure dependency management with known CVEs
- Unsafe use of eval() and dynamic code execution
- Missing input validation and sanitization protocols
- Weak authentication patterns and session management
- Sensitive data exposure in code repositories

---

## Solution Architecture

CodeSentinel addresses this gap through integrated automation:

```
GitHub Repository -> AI Analysis Engine -> Risk Scoring -> Security Report
```

### Core Components

1. GitHub API integration for repository traversal
2. Multi-language code analysis powered by Groq LLaMA3-70B
3. Machine learning-based risk scoring algorithm
4. Professional security dashboard with real-time insights
5. Role-based access control with JWT authentication

---

## Features Overview

### Security & Authentication

- **JWT-Based Authentication** - Secure token generation and validation
- **Password Hashing** - bcrypt with 12-round salt
- **Protected Routes** - Frontend and backend route protection
- **Token Lifecycle Management** - Automatic refresh and expiration

### GitHub Integration

- **Repository Scanning** - Fetch and analyze any public GitHub repo
- **Recursive Traversal** - Complete codebase analysis
- **Content Decoding** - Base64 decoding and text extraction
- **Multi-Format Support** - 15+ file types including source code, configs, and manifests

### AI-Powered Analysis

- **Groq LLaMA3-70B Model** - Free tier with enterprise performance
- **Language-Specific Detection** - Custom analysis rules per programming language
- **10+ Vulnerability Classes** - Comprehensive threat coverage
- **Remediation Guidance** - Plain-English explanations with code-level fixes

### Security Scoring & Reporting

- **Overall Risk Assessment** - 0-100 security score
- **Granular Classification** - Critical, High, Medium, Low severity levels
- **File-Level Analysis** - Per-file vulnerability breakdown
- **Real-Time Polling** - Async scan updates with 4-second intervals

### Vulnerability Detection

| Category | Examples |
|----------|----------|
| **Injection Attacks** | SQL injection, NoSQL injection, LDAP injection |
| **Authentication** | Weak credentials, hardcoded secrets, insecure session management |
| **Data Exposure** | Sensitive information in code, unencrypted storage |
| **Code Execution** | eval() usage, command injection, unsafe deserialization |
| **Third-Party Risks** | Known CVEs, outdated dependencies, malicious packages |
| **Input Validation** | XSS vulnerabilities, buffer overflow, format string attacks |
| **Misconfiguration** | Exposed debug modes, insecure headers, CORS misconfiguration |

### Multi-Language Support

Supported languages and file types:
- JavaScript, TypeScript, React
- Python (2.7, 3.x)
- PHP (5.x, 7.x, 8.x)
- Java, C#, Go
- SQL, YAML, JSON
- Environment configuration files (.env, .properties)

### Advanced Features

- **Background Processing** - Non-blocking async task execution
- **Horizontal Scalability** - Stateless API for distributed deployment
- **Error Recovery** - Automatic retry logic with exponential backoff
- **Data Persistence** - MongoDB Atlas for scan history and audit trails
- **Responsive Design** - Dark-themed, mobile-optimized dashboard
- **Real-Time Updates** - Live scanning status with progress indicators

---

## Technology Stack

### Frontend Technologies

**Core Stack:**
- React 18.x - Component-based UI architecture
- Vite 5.x - Fast module bundling and HMR
- Tailwind CSS 4.x - Utility-first design system
- React Router 6.x - Client-side navigation

**Supporting Libraries:**
- Axios - API communication with interceptors
- Lucide React - Icon library
- React Hot Toast - Toast notification system

### Backend Technologies

**Core Stack:**
- Python 3.11+ - High-performance, type-safe backend
- FastAPI 0.100+ - Modern async web framework
- MongoDB Atlas - NoSQL document database (M0 free tier)

**Supporting Libraries:**
- PyMongo - MongoDB Python driver
- python-jose - JWT token generation and validation
- passlib[bcrypt] - Secure credential storage
- httpx - Async HTTP requests (GitHub, Groq)
- Groq SDK - LLaMA3-70B inference API

### Infrastructure & Deployment

| Service | Purpose | Tier | Cost |
|---------|---------|------|------|
| **Vercel** | Frontend + Backend hosting | Free | $0/month |
| **MongoDB Atlas** | Cloud database | M0 (Shared) | $0/month |
| **GitHub API** | Repository data access | Public | $0/month |
| **Groq API** | AI model inference | Free | $0/month |
| **TOTAL** | - | - | **$0/month** |

---

## System Design

### Architecture Overview

```
PRESENTATION LAYER
- React 18 + Vite + Tailwind CSS (Dark Theme)
- Landing Page -> Authentication -> Dashboard -> Reporting
- Features: Real-time updates, responsive design, dark mode

API GATEWAY LAYER
- FastAPI
- Authentication Routes:
  - POST /api/auth/register - User registration
  - POST /api/auth/login - Token generation
  - GET /api/auth/me - Current user profile
- Scan Management Routes:
  - POST /api/scans/ - Initiate scan (202)
  - GET /api/scans/ - List user scans
  - GET /api/scans/{id} - Retrieve full report
  - DELETE /api/scans/{id} - Remove scan record

SERVICE LAYER
- GitHub Integration Service
  - Repository tree traversal
  - File content retrieval with base64 decoding
  - Language detection from file extensions
  - Recursive directory processing

- File Processing Service
  - Content chunking for LLM token limits
  - Language-specific filtering
  - Sensitive file detection
  - Code extraction and normalization

- AI Analysis Service
  - Groq LLaMA3-70B API integration
  - Language-specific security prompts
  - Structured vulnerability extraction
  - Response parsing and validation

- Risk Scoring Service
  - Vulnerability weight calculation
  - Severity classification algorithm
  - Overall score computation (0-100)
  - Executive summary generation

DATA PERSISTENCE LAYER
- MongoDB Atlas (M0)
- Users Collection
- Scans Collection
```

### Scan Request Processing Workflow

```
STEP 1: REQUEST INITIATION
1. User submits GitHub repo URL via frontend
2. POST /api/scans/ with repo_url
3. FastAPI validates user JWT token
4. Scan record created (status: "scanning")

STEP 2: IMMEDIATE RESPONSE
1. HTTP 202 Accepted sent to client
2. Include: scan_id, status, estimated_time
3. Client stores scan_id in state

STEP 3: ASYNCHRONOUS PROCESSING (Background)
1. asyncio task spawned by FastAPI
2. GitHub API: Fetch repository tree structure
3. Download up to 20 code files (ordered by priority)
4. File processor: Language detection, filtering, chunking
5. FOR EACH file: Send to Groq API for security analysis
6. Parse response: vulnerabilities extracted
7. Store: severity, location, description, fix
8. Risk Scorer: Calculate weighted overall score
9. Build executive summary and report
10. MongoDB update: status = "done", populate fields

STEP 4: CLIENT POLLING
1. Frontend polls /api/scans/{id} every 4 seconds
2. While status = "scanning": show loading spinner
3. When status = "done": render full security report
4. Display: Score, risk level, top 5 vulnerabilities, file breakdown
```

---

## Project Structure

```
codesentinel/

client/                                 (React + Vite Frontend)
  public/
  src/
    context/
      AuthContext.jsx                  (Global authentication state)
    pages/
      Landing.jsx                      (Marketing/hero page)
      Login.jsx                        (User login form)
      Register.jsx                     (User registration form)
      Dashboard.jsx                    (Scan history and statistics)
      Scan.jsx                         (Repository input page)
      Report.jsx                       (Security report display)
    components/
      Header.jsx                       (Navigation component)
      Footer.jsx                       (Footer component)
      ProtectedRoute.jsx               (Route wrapper)
    utils/
      api.js                           (Axios instance with interceptors)
    App.jsx                            (Router configuration)
    main.jsx                           (React entry point)
    index.css                          (Tailwind CSS imports)
  .env
  vite.config.js
  package.json

server/                                 (FastAPI Python Backend)
  config/
    database.py                        (MongoDB connection)
  controllers/
    auth.py                            (Authentication logic)
    scan.py                            (Scan CRUD operations)
  middleware/
    auth.py                            (JWT verification dependency)
  models/
    user.py                            (User document schema)
    scan.py                            (Scan document schema)
  routes/
    auth.py                            (/api/auth/* endpoints)
    scans.py                           (/api/scans/* endpoints)
  services/
    github.py                          (GitHub API client)
    file_processor.py                  (Code analysis preparation)
    analyzer.py                        (Groq AI integration)
    risk_scorer.py                     (Scoring algorithm)
  utils/
    auth.py                            (JWT and bcrypt utilities)
  main.py                              (FastAPI application)
  requirements.txt                     (Python dependencies)
  .env
```

---

## Installation & Setup

### Prerequisites

**Software Requirements:**
- Python 3.11 or higher (https://www.python.org/downloads/)
- Node.js 18.x or higher (https://nodejs.org/)
- Git (https://git-scm.com/)

**External Accounts Required:**
- MongoDB Atlas (free M0 tier) - https://mongodb.com/atlas
- Groq API (free tier) - https://console.groq.com
- GitHub Token (optional) - https://github.com/settings/tokens

---

### 1. Repository Setup

```bash
git clone https://github.com/farhannaeem00/codesentinel.git
cd codesentinel
```

---

### 2. Backend Configuration

#### Install Dependencies

```bash
cd server
python -m venv venv
```

**Activate Virtual Environment:**

```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create `server/.env`:

```env
PORT=8000
SECRET_KEY=your_super_secret_key_minimum_32_characters_for_security
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/codesentinel?retryWrites=true&w=majority
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

#### Launch Backend Server

```bash
uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Access API Documentation:**
- http://localhost:8000/docs (Interactive Swagger UI)
- http://localhost:8000/redoc (ReDoc documentation)

---

### 3. Frontend Configuration

#### Install Dependencies

```bash
cd ../client
npm install
```

#### Configure Environment Variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

#### Launch Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in 234 ms

Local:   http://localhost:5173/
press h to show help
```

---

### 4. Verify Installation

Open browser and navigate to: http://localhost:5173

**Verification Checklist:**
- Landing page loads without errors
- Registration creates new user account
- Login generates valid JWT token
- Dashboard displays (empty on first use)
- Can submit repository URL for scanning
- Backend API responds on http://localhost:8000/docs

---

## API Documentation

### Authentication Endpoints

#### User Registration

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f3b2c1abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### User Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f3b2c1abc123def456789",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": "64f3b2c1abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### Scan Management Endpoints

#### Initiate Security Scan

```
POST /api/scans/
Authorization: Bearer {token}
Content-Type: application/json

{
  "repo_url": "https://github.com/owner/repository"
}
```

**Success Response (202 Accepted):**

```json
{
  "success": true,
  "message": "Scan initiated. Processing may take 1-2 minutes.",
  "scan_id": "64f3b2c1abc123def456789",
  "status": "scanning",
  "repo_name": "repository",
  "owner": "owner"
}
```

---

#### List User Scans

```
GET /api/scans/
Authorization: Bearer {token}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "count": 3,
  "scans": [
    {
      "id": "64f3b2c1abc123def456789",
      "repo_name": "my-project",
      "repo_url": "https://github.com/owner/my-project",
      "status": "done",
      "overall_score": 75,
      "risk_level": "medium",
      "created_at": "2025-01-15T10:30:00Z",
      "completed_at": "2025-01-15T10:35:00Z"
    }
  ]
}
```

---

#### Get Detailed Scan Report

```
GET /api/scans/{scan_id}
Authorization: Bearer {token}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "64f3b2c1abc123def456789",
    "repo_name": "my-project",
    "status": "done",
    "overall_score": 75,
    "risk_level": "medium",
    "summary": "Repository contains moderate security risks.",
    "total_issues": 12,
    "critical_count": 1,
    "high_count": 3
  }
}
```

---

#### Delete Scan Record

```
DELETE /api/scans/{scan_id}
Authorization: Bearer {token}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Scan deleted successfully"
}
```

---

## Deployment Guide

### Frontend Deployment (Vercel)

1. Push repository to GitHub
2. Go to https://vercel.com/
3. Click "New Project" and import your repository
4. Add environment variable: `VITE_API_URL` = your backend URL
5. Deploy - Vercel auto-deploys on git push

### Backend Deployment (Vercel)

1. Create `vercel.json` in server root with Python configuration
2. Add environment variables in Vercel Project Settings
3. Run `vercel deploy`

### MongoDB Atlas Setup

1. Go to https://mongodb.com/atlas
2. Create free M0 cluster
3. Configure IP whitelist and create database user
4. Copy connection string to environment variables

### Groq API Setup

1. Visit https://console.groq.com
2. Sign up and generate API key
3. Add to environment variables: `GROQ_API_KEY`

---

## Contributing Guidelines

We welcome contributions to CodeSentinel!

### Commit Message Convention

- **Add:** New feature or functionality
- **Fix:** Bug fix or issue resolution
- **Update:** Improvement to existing feature
- **Refactor:** Code restructuring without behavior change
- **Docs:** Documentation creation or updates
- **Security:** Security vulnerability fix
- **Test:** Test additions or modifications
- **Chore:** Maintenance tasks, dependency updates

### Contribution Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit with meaningful messages
4. Push to branch: `git push origin feature/your-feature`
5. Open Pull Request with clear description

---

## License

MIT License - Copyright (c) 2025 Farhan Naeem

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

## Additional Resources

- GitHub Repository: https://github.com/farhannaeem00/codesentinel
- Issue Tracker: https://github.com/farhannaeem00/codesentinel/issues
- Author Profile: https://github.com/farhannaeem00
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- CWE Database: https://cwe.mitre.org/

---

## Author

**Farhan Naeem**

BS Computer Science Student | Full Stack Developer | AI Enthusiast | Security Advocate

- GitHub: https://github.com/farhannaeem00
- LinkedIn: https://linkedin.com/in/farhannaeem00
- Twitter: https://twitter.com/farhannaeem00

---

**CodeSentinel — Securing Code Through Intelligent Analysis**

Made with dedication for the Developer Community
