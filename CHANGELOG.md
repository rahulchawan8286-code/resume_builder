# CHANGELOG

## Bug Fixes & Stability Improvements

### 1. Missing Environment Variables Handling (Graceful Degradation)
- **MongoDB**: The server no longer crashes with `process.exit(1)` when `MONGO_URI` is missing or the connection fails. It logs a warning and allows the server to boot gracefully.
- **AI Integration (OpenAI/Gemini)**: The AI service instantiation no longer crashes on boot when `OPENAI_API_KEY` is missing. A fallback key is provided during `openai` setup, and the `generate()` function intercepts the call to gracefully return `{ "success": false, "message": "AI Provider is not configured." }` if the key is missing.
- **Cloudinary Integration**: Disabled Cloudinary features gracefully when `CLOUDINARY_CLOUD_NAME` is missing. File uploads return a mock image URL (`https://via.placeholder.com/150`), and `delete` and `getOptimizedUrl` operations bypass execution safely.

### 2. Frontend React 19 & Dependency Conflicts
- **npm ERESOLVE Peer Conflicts**: Solved strict dependency conflict errors (like `lucide-react`, `framer-motion`, and `@dnd-kit/core` requiring React 16-18) by injecting an npm `overrides` rule into the client `package.json` for React 19.
- **`npm install` Resiliency**: You can now run `npm install` in the client directory without requiring `--legacy-peer-deps`.

### 3. Frontend Build Errors
- **Broken Imports**: Fixed an invalid import in the `AdminDashboardPage` component that was attempting to import `mockData` from `mockData.js` instead of the correct `mockAdminData.js`.
- **Deprecated Syntax (Zundo)**: Replaced the removed `useTemporalStore` hook with `useStore(useResumeStore.temporal)` in `AutosaveBar.jsx` to correctly support Zundo v2's integration with Zustand v4.

### 4. Server API Polish
- **Health Check Standardization**: The `GET /api/health` endpoint now explicitly returns `{"success": true, "message": "Server running"}` as required by standard health check bots and integrations.
- **Unhandled Promise Rejections**: Prevented the generic unhandled rejection middleware in `server.js` from killing the process `process.exit(1)`, avoiding unintended cascading shutdowns when unhandled promise errors crop up.

## Modified Files
1. `client/package.json`
2. `client/src/features/admin/pages/AdminDashboardPage.jsx`
3. `client/src/features/resume-builder/components/Editor/AutosaveBar.jsx`
4. `server/app.js`
5. `server/config/db.js`
6. `server/middleware/error.js`
7. `server/server.js`
8. `server/services/ai/OpenAIProvider.js`
9. `server/services/cloudinary/cloudinaryProvider.js`

## Remaining Manual Steps
The project is now fully resilient and runs successfully without initial configuration.
To unlock its full functionality (database persistence, AI generation, and image uploads), you will need to:
1. Copy `.env.example` to `.env` in the root directory (or in both `/client` and `/server` depending on your environment architecture).
2. Provide your actual `MONGO_URI`.
3. Provide your `OPENAI_API_KEY` (or `GEMINI_API_KEY` once implemented).
4. Provide your Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
