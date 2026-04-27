# College Event Statistics Portal

Full-stack college event analytics portal built with React, Node.js, Express, and PostgreSQL.

## Project Structure

- `frontend/` React app with Tailwind CSS, React Router, Axios, and charts
- `backend/` Express REST API with JWT auth and PostgreSQL access
- `database/` PostgreSQL schema and seed-ready SQL

## Folder Structure

```text
college-event-portal/
frontend/
backend/
database/
```

## Backend Setup

1. Create a PostgreSQL database named `college_event_portal` or update the connection string.
2. Run `database/schema.sql` to create the tables and default departments.
3. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN`.
4. Install dependencies in `backend/` and run `npm run dev`.
5. Seed the admin account with `npm run seed:admin`.

Default seed credentials are:

- Email: `admin@college.edu`
- Password: `password123`

## PostgreSQL Schema

The schema includes:

- `users`
- `departments`
- `events`
- `participants`
- `results`

Foreign keys, uniqueness rules, and indexes are included for relational integrity and reporting performance.

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Install dependencies in `frontend/`.
3. Start the app with `npm run dev`.
4. Open the login page and sign in with the seeded admin account.

## API Integration

The frontend uses Axios with JWT token injection and communicates with these endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
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

## Dashboard Charts

The dashboard includes:

- Events by Department
- Monthly Event Trend
- Category Breakdown
- Internal vs External Participants
- Top Active Departments
- Winners Leaderboard

## Run Locally

1. Create PostgreSQL database and run `database/schema.sql`.
2. Configure `backend/.env` from `backend/.env.example` and `frontend/.env` from `frontend/.env.example`.
3. Install dependencies in `backend/` and `frontend/`.
4. From the workspace root, run `npm run dev` to start both apps together.
5. If you prefer separate terminals, run `npm run dev --prefix backend` and `npm run dev --prefix frontend`.

## Deployment Guide

Backend deployment:

1. Deploy the Express API to a Node.js host such as Render, Railway, Fly.io, or a VM.
2. Set production environment variables for `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `CLIENT_ORIGIN`.
3. Point `DATABASE_URL` to a managed PostgreSQL service.
4. Run the schema SQL against the production database.
5. Seed or create the admin user once the database is live.

Frontend deployment:

1. Build the React app with `npm run build`.
2. Deploy the generated `dist/` folder to Vercel, Netlify, or any static host.
3. Set `VITE_API_URL` to the deployed backend API URL.
4. Confirm CORS allows the frontend origin.

Production checklist:

- Use strong JWT secrets.
- Keep the database credentials out of source control.
- Enable HTTPS on both frontend and backend.
- Point the frontend Axios base URL to the deployed API.
- Verify login, event CRUD, charts, and CSV export after deployment.
