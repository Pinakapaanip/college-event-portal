# Deployment Guide

This project is ready to deploy as a frontend on Vercel, a backend on Render, and PostgreSQL on Supabase.

## 1) Supabase

1. Create a new Supabase project.
2. Open the SQL editor and run `database/schema.sql`.
3. Import the dataset into the matching tables from the `data/` folder.
4. Copy the database connection string for the backend.

## 2) Backend on Render

1. Push the repository to GitHub.
2. Create a new Render Web Service from the repo.
3. Set the service root to `backend`.
4. Use these settings:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `DATABASE_URL` = Supabase connection string
   - `JWT_SECRET` = a long random secret
   - `CLIENT_ORIGIN` = your Vercel URL
   - `NODE_ENV` = `production`
6. Deploy and confirm `GET /health` works.

## 3) Frontend on Vercel

1. Import the repo into Vercel.
2. Set the project root to `frontend`.
3. Add environment variable:
   - `VITE_API_URL` = `https://<your-render-backend>/api`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy and confirm the app loads.

## 4) Connect Everything

1. Update backend `CLIENT_ORIGIN` to the final Vercel URL.
2. Redeploy backend.
3. Verify the frontend can call the backend without CORS errors.
4. Test Dashboard, View Events, Participants, Results, and Analytics.

## 5) Local Commands

```bash
cd backend
npm install
npm start

cd ../frontend
npm install
npm run build
```