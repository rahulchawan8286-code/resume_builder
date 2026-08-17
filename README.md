# ECE Career Compass

An advanced, AI-driven placement preparation portal tailored for Electronics and Communication Engineering (ECE) students. ECE Career Compass integrates core engineering concepts, coding practice, aptitude tests, ATS-friendly resume generation, and personalized AI-driven mock interviews into a single, cohesive platform.

## Features

- **Authentication & Security**: Secure JWT-based authentication with access and refresh tokens. Role-based access control (Student vs. Admin).
- **Dashboard & Readiness**: Real-time aggregated readiness scores spanning Core ECE, Aptitude, Coding, and HR readiness.
- **AI Career Intelligence (Phase 8)**: Aggregates student performance across all modules and generates a personalized, deterministic AI career analysis.
- **AI Mock Interviews (Phase 9)**: Dynamic, role-specific mock interviews powered by Gemini AI. Strict JSON validation ensures safe, reliable feedback (strengths, weaknesses, missing concepts).
- **Resume Builder & ATS (Phase 6)**: Create professional resumes with autosave functionality. Run them through an AI-powered ATS scanner to receive formatting and keyword feedback.
- **Coding Practice (Phase 5)**: Browse coding problems by topic and difficulty. Track progress and maintain submission history. *(Note: Code execution is simulated for security purposes)*.
- **Core ECE & Aptitude (Phases 3-4)**: Timed, subject-specific quizzes with immediate feedback and historical tracking.
- **Companies & Roadmaps (Phase 7)**: Explore target companies, bookmark them, and generate personalized multi-week preparation roadmaps.

## Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Zustand (modular stores for Auth, Resume, Interviews, etc.)
- **Styling**: Tailwind CSS, generic CSS, Radix UI primitives, Lucide React icons
- **Routing**: React Router DOM (v6) with Protected and Admin route guards
- **API Client**: Axios with automated token refresh interceptors

### Backend
- **Framework**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **Security**: Helmet, CORS, Express Rate Limit

## Folder Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers (business logic)
│   │   ├── middleware/       # Auth, error, and validation middlewares
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Complex business logic & AI integration
│   │   ├── utils/            # Helpers & formatters
│   │   └── validators/       # Zod schemas for request validation
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/              # Axios instance and API services
    │   ├── components/       # Reusable UI components
    │   ├── features/         # Domain-specific components
    │   ├── layouts/          # Dashboard and Auth layouts
    │   ├── pages/            # Top-level route components
    │   ├── routes/           # React Router configuration
    │   └── store/            # Zustand state stores
    └── package.json
```

## Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 2. Environment Variables
Duplicate `.env.example` to `.env` in the root directory or `backend/` directory and configure the variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Database Seeding (Development Only)
Populate the database with initial subjects, companies, coding problems, and quizzes:
```bash
cd backend
node src/scripts/seed_all.js # (Ensure you have combined or run individual seed scripts)
```

### 5. Running the Application
```bash
# Terminal 1: Run Backend (from /backend)
npm run dev

# Terminal 2: Run Frontend (from /frontend)
npm run dev
```

## Security Considerations
- **IDOR Protection**: All user-specific queries strictly validate against `req.user._id` derived securely from the verified JWT.
- **No Mock Data**: The production runtime does not rely on mock UI placeholders for actual operations.
- **AI Fallbacks**: AI functions include deterministic fallbacks to prevent crashes if Gemini rate limits or fails.
- **Error Handling**: Stack traces and internal MongoDB errors are suppressed in production.

## Known Limitations
1. **Code Execution Sandbox**: The Coding Practice module currently simulates "Accepted" statuses upon submission. A secure Docker-based or third-party (e.g., Judge0) code execution engine is required for actual compilation and validation.
2. **Email Verification**: Password reset and email verification flows are currently simulated in the UI. A mailer service (e.g., SendGrid, Nodemailer) needs to be configured on the backend.
