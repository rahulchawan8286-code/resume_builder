# AI-Powered Resume Builder

An advanced, full-stack resume builder application that leverages AI to help users create professional, ATS-friendly resumes. It features a rich editor, customizable templates, an admin dashboard, and AI-assisted content generation.

## 🌟 Features

- **Dynamic Resume Editor**: Real-time preview with autosave functionality.
- **AI Assistant**: Get intelligent suggestions for your objective, experience, and skills using AI.
- **Multiple Themes & Templates**: Customize the look and feel of your resume.
- **ATS Optimization**: Generates resumes optimized for Applicant Tracking Systems.
- **Export to PDF**: Download your polished resume instantly.
- **User Authentication**: Secure login, registration, and profile management.
- **Admin Dashboard**: Manage users, templates, AI logs, and system settings.

## 🛠️ Technology Stack

**Frontend (Client):**
- React.js (Vite)
- Tailwind CSS
- Zustand (State Management)
- Axios

**Backend (Server):**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- Cloudinary for image uploads
- OpenAI API for AI integrations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance (local or Atlas)
- Cloudinary Account (for uploads)
- OpenAI API Key (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahulchawan8286-code/resume_builder.git
   cd resume_builder
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example and configure your variables
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 🌐 Live Site

> *The live site link will be updated here once the application is deployed.*

## 📄 License

This project is licensed under the MIT License.
