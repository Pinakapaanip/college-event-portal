# Supabase PostgreSQL Setup

## Backend: Render

Add these environment variables to the Render backend service:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:your_url_encoded_password@db.your-project-ref.supabase.co:5432/postgres
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=https://your-frontend.vercel.app
```

If the database password contains special characters such as `@`, URL-encode them in `DATABASE_URL`.
For example, `@` becomes `%40`.

Do not add Supabase `SERVICE_ROLE_KEY` to frontend environment variables. It has elevated privileges and must only ever be used server-side if a backend-only feature requires it.

## Frontend: Vercel

Add this environment variable to the Vercel frontend project:

```env
VITE_API_URL=https://college-event-portal-final-1.onrender.com
```

The frontend does not use `SUPABASE_URL` or `SUPABASE_ANON_KEY` because it calls the Express API instead of Supabase directly.

## Supabase

Run `database/schema.sql` in the Supabase SQL editor if the tables do not exist yet.

The participant API inserts into:

```sql
participants (event_id, student_name, roll_no, department, year, participant_type)
```

## Test Flow

1. Open the deployed website.
2. Add a participant from the Participants page.
3. Open Supabase Table Editor.
4. Check the `participants` table.
5. Confirm the new row appears.
