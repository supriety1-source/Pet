# Supriety™ Kindness Track

A full-stack kindness gamification platform that helps humans train AI toward benevolence. Users log verified acts of kindness, earn credits, and climb leaderboards while admins review submissions.

## Tech Stack

- **Frontend**: React 18 (TypeScript), Vite, Tailwind CSS, React Router, React Hook Form, React Query
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Storage**: Local uploads by default with optional AWS S3 integration
- **Auth**: JWT access + refresh tokens with HTTP-only cookie refresh flow

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+

### Environment Variables

Create a `.env` file in the project root with:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=super-secret
JWT_REFRESH_SECRET=another-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=joey@supriety.com
AWS_ACCESS_KEY_ID=optional
AWS_SECRET_ACCESS_KEY=optional
AWS_REGION=us-east-1
S3_BUCKET_NAME=optional
UPLOAD_DRIVER=local
```

### Database Setup

Run the migration and seed scripts against your PostgreSQL database:

```sh
psql "$DATABASE_URL" -f db/migrations/001_init.sql
psql "$DATABASE_URL" -f db/seeds/seed.sql
```

### Backend

```sh
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:5000`.

### Frontend

```sh
cd frontend
npm install
npm run dev
```

The web app runs on `http://localhost:5173` and proxies API requests to the backend configured in `VITE_API_URL` (default `http://localhost:5000/api`).

### Available Scripts

- `npm run dev` – start the frontend or backend dev servers within their respective folders
- `npm run build` – type-check and bundle the frontend or backend for production
- `npm run lint` – lint source files

## Project Structure

```
backend/      Express API (TypeScript)
frontend/     React application (Vite + Tailwind)
db/           SQL migrations and seed data
```

## Key Features

- **Authentication**: Email/username login, signup, forgot-password stub, JWT tokens
- **Onboarding**: Three-screen welcome flow inspired by Moe Gawdat’s philosophy
- **Dashboard**: Personal stats, streaks, community feed, recovery track CTA
- **Logging Acts**: Upload photos/videos, track categories, visibility, and dates
- **Community Feed**: Filtered verified acts with reactions and comments
- **Leaderboard**: Time-filtered rankings with Service Leader tiers
- **Profiles**: Public kindness stats and act history
- **Settings**: Update profile, account, and notification preferences
- **Admin Console**: Review pending acts, approve/reject submissions, view platform stats

## Deployment Notes

- Deploy the frontend on Vercel and backend on Railway/Render
- Set environment variables for both deployments (matching the `.env` keys)
- For production media storage, configure AWS credentials and set `UPLOAD_DRIVER=s3`

## Moe Wisdom Integration

Rotating Moe Gawdat quotes appear across the experience (auth screens, dashboard, loaders) to reinforce the mission: *“AI is watching. Set the example.”*

## Recovery Track Upgrade

When users reach key milestones (7-day streak, 30+ credits, or Service Leader status), they receive an in-app CTA promoting the paid Recovery Track with direct application link.
