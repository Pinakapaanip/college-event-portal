# College Event Statistics Portal

A full-stack college event analytics portal built with React, Node.js, Express, and PostgreSQL.

## Overview

This project tracks events, participants, departments, and results, then presents the data in a dashboard with charts, summaries, and leaderboard-style reporting.

## Project Structure

- `frontend/` React app built with Vite, Tailwind CSS, Axios, React Router, and Chart.js
- `backend/` Express REST API with JWT authentication, security middleware, and PostgreSQL access
- `database/` PostgreSQL schema and SQL for initializing the database

## Run Modes

- Root `npm run dev` starts both backend and frontend together through `dev.js`
- `npm run backend` starts only the API
- `npm run frontend` starts only the client app

## Backend Setup

1. Create a PostgreSQL database named `college_event_portal` or update the connection string in your environment file.
2. Run `database/schema.sql` to create the tables and default departments.
3. Copy `backend/.env.example` to `backend/.env`.
4. Set these backend values:
   - `PORT=5050`
   - `DATABASE_URL=postgresql://postgres:password@localhost:5432/college_event_portal`
   - `JWT_SECRET=replace_with_a_long_random_secret`
   - `CLIENT_ORIGIN=http://localhost:5173`
5. Install dependencies in `backend/` and run `npm run dev`.
6. Seed the admin account with `npm run seed:admin`.

Default seed credentials:

- Email: `admin@college.edu`
- Password: `password123`

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_API_URL=http://localhost:5050/api`.
3. Install dependencies in `frontend/`.
4. Start the app with `npm run dev`.
5. Sign in with the seeded admin account.

## API Endpoints

The frontend communicates with these API routes:

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/departments`
- `POST /api/participants`
- `GET /api/participants/event/:eventId`
- `POST /api/results`
- `GET /api/results`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/events-by-department`
- `GET /api/dashboard/monthly-trend`
- `GET /api/dashboard/category-breakdown`
- `GET /api/dashboard/participant-mix`
- `GET /api/dashboard/top-departments`
- `GET /api/dashboard/winners-leaderboard`

## Dashboard Features

- Events by Department
- Monthly Event Trend
- Category Breakdown
- Internal vs External Participants
- Top Active Departments
- Winners Leaderboard

## Database Schema

The schema includes these core tables:

- `users`
- `departments`
- `events`
- `participants`
- `results`

Foreign keys, uniqueness rules, and indexes are included for relational integrity and reporting performance.

## Deployment Notes

Backend:

1. Deploy the Express API to a Node.js host such as Render, Railway, Fly.io, or a VM.
2. Set production values for `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `CLIENT_ORIGIN`.
3. Point `DATABASE_URL` to a managed PostgreSQL instance.
4. Run the schema SQL against the production database.
5. Seed or create the admin user once the database is live.

Frontend:

1. Build the app with `npm run build` inside `frontend/`.
2. Deploy the generated `dist/` folder to Vercel, Netlify, or another static host.
3. Set `VITE_API_URL` to the deployed backend API URL.
4. Confirm CORS allows the frontend origin.

Production checklist:

- Use a strong JWT secret.
- Keep database credentials out of source control.
- Enable HTTPS on both frontend and backend.
- Verify login, event CRUD, dashboard charts, and CSV export after deployment.
