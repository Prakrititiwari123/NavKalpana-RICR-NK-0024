# HealthNexus

HealthNexus is a full-stack fitness and wellness app with a React + Vite frontend and an Express + MongoDB backend. It provides public marketing pages and authenticated dashboard experiences for tracking workouts, nutrition, and progress, plus AI-powered features.

## Overview

- Frontend: React 19, Vite 7, Tailwind CSS 4
- Backend: Node.js, Express, MongoDB (Mongoose)
- Integrations: Cloudinary, Gmail (Nodemailer), Groq

## Project Structure

```
backend/
frontend/
```

## Quick Start

### 1) Backend

```bash
cd backend
npm install
```

Create a .env file in the backend folder:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string

CLOUDNARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDNARY_API_KEY=your_cloudinary_api_key
CLOUDNARY_API_SECRET=your_cloudinary_api_secret

GMAIL_USER=your_gmail_address
GMAIL_PASSCODE=your_gmail_app_password

GROQ_API_KEY=your_groq_api_key
```

Run the API server:

```bash
npm run dev
```

### 2) Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Vite runs at http://localhost:5173 by default.

## Configuration Notes

- Frontend API base URL is in [frontend/src/config/Api.jsx](frontend/src/config/Api.jsx).
- Backend CORS origin is set in [backend/server.js](backend/server.js).
- Backend defaults to port 5000 unless `PORT` is set.

## Scripts

### Backend

- `npm run dev` start with nodemon
- `npm start` run in production mode

### Frontend

- `npm run dev` start Vite dev server
- `npm run build` build for production
- `npm run preview` preview production build
- `npm run lint` run ESLint

## Features

- Auth and user management
- Dashboard views for workouts, diet, and tracking
- File/image uploads via Cloudinary
- Email support via Gmail/Nodemailer
- AI endpoints powered by Groq

## Architecture And Data Flow

- Browser UI calls the backend API using Axios.
- Backend handles auth, business logic, and data persistence in MongoDB.
- Files and images are uploaded to Cloudinary.
- Emails are sent via Gmail using Nodemailer.
- AI features call Groq via the Groq SDK.

## Environment Variables (Detailed)

- `PORT` backend HTTP port (defaults to 5000)
- `MONGO_URI` MongoDB connection string used by Mongoose
- `CLOUDNARY_CLOUD_NAME` Cloudinary account name
- `CLOUDNARY_API_KEY` Cloudinary API key
- `CLOUDNARY_API_SECRET` Cloudinary API secret
- `GMAIL_USER` Gmail address used for outbound email
- `GMAIL_PASSCODE` Gmail app password for Nodemailer auth
- `GROQ_API_KEY` Groq API key for AI requests

## Ports And URLs

- Frontend dev server: http://localhost:5173
- Backend API default: http://localhost:5000
- Frontend API base URL in [frontend/src/config/Api.jsx](frontend/src/config/Api.jsx)
- Backend CORS origin in [backend/server.js](backend/server.js)

## API Routes Summary

- `GET /` server health check
- `/auth/*` authentication and OTP flows
- `/user/*` user and profile endpoints
- `/api/v1/ai/*` AI and chat endpoints

## Troubleshooting

- 401 or cookie issues: ensure `withCredentials` is true and the frontend origin matches backend CORS.
- Cloudinary errors: confirm `CLOUDNARY_*` values are correct and active.
- MongoDB connection errors: verify `MONGO_URI` and network access.
- Email failures: use a Gmail app password and confirm account security settings.
- AI failures: verify `GROQ_API_KEY` and account limits.
