# College Event Statistics Portal

A full-stack college event analytics portal built with React, Node.js, Express, and PostgreSQL.

## 🎯 Overview

This project tracks events, participants, departments, and results, then presents the data in a dashboard with charts, summaries, and leaderboard-style reporting.

**Now with real dataset integration** - Load Excel/CSV data directly into the database with a single command!

## 📁 Project Structure

- `frontend/` React app built with Vite, Tailwind CSS, Axios, React Router, and Chart.js
- `backend/` Express REST API with JWT authentication, security middleware, and PostgreSQL access
- `database/` PostgreSQL schema and SQL for initializing the database
- `data/` Real datasets (events, participants, results, participation tracking)

## 🚀 Quick Start

### Prerequisites
- PostgreSQL running locally
- Node.js and npm installed

### Setup (30 seconds)

```bash
# 1. Backend setup
cd backend
npm install
npm run setup:db       # Initialize database
npm run load:data      # Load datasets from Excel/CSV
npm run seed:admin     # Create admin account

# 2. Frontend setup
cd ../frontend
npm install

# 3. Start everything
cd ..
npm run dev
```

Then open `http://localhost:5173` and login with:
- Email: `admin@college.edu`
- Password: `password123`

## 📚 Documentation

- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Detailed setup instructions
- [DATA_INTEGRATION_SUMMARY.md](DATA_INTEGRATION_SUMMARY.md) - Technical implementation details

## 🎨 Features

### Dashboard
- Real-time statistics (total events, participants, departments)
- Events by department visualization
- Monthly event trends
- Category distribution analysis
- Internal vs external participant split
- Top active departments
- Winners leaderboard

### Events Management
- View all events with pagination
- Filter by department and category
- Search by title, venue, or organizer
- Date range filtering
- Export events to CSV
- Add new events (admin)

### Participants & Results
- View participants per event
- Add participants with duplicate prevention
- Display results and leaderboard
- Rank winners with prizes
- Attendance tracking

### Analytics
- Dynamic filtering by date, department, and category
- Real-time chart updates
- Participant analysis by department
- Event timeline visualization

## 🔌 API Endpoints

### Core Resources
- `GET /events` - List events with filters, pagination, sorting
- `GET /events/:id` - Get single event details
- `POST /events` - Create event (admin only)
- `GET /departments` - List all departments
- `GET /participants/event/:id` - Get event participants
- `POST /participants` - Add participant
- `GET /results` - Get results with optional event filter
- `GET /results/leaderboard` - Get top results/winners
- `POST /results` - Add result (admin only)

### Analytics
- `GET /dashboard/summary` - Overview statistics
- `GET /dashboard/events-by-department` - Department breakdown
- `GET /dashboard/monthly-trend` - Monthly event trends
- `GET /dashboard/category-breakdown` - Category distribution
- `GET /dashboard/participant-mix` - Internal vs external split
- `GET /dashboard/top-departments` - Top departments by participation
- `GET /dashboard/winners-leaderboard` - Top winners

## 📊 Real Datasets

The application loads data from:
- **events** - CSV file with event details
- **participants** - Excel file with student information
- **participation** - Excel file with attendance records
- **results** - CSV file with rankings and prizes

Data is automatically normalized and deduplicated during load.

## 🔐 Authentication

JWT-based authentication with role-based access control:
- **Admin**: Full access including data management
- **User**: Read-only access to data

Default admin credentials (after seeding):
- Email: `admin@college.edu`
- Password: `password123`

## 💾 Database

PostgreSQL with optimized schema:
- Departments, Events, Participants, Participation, Results tables
- Strategic indexes for fast queries
- Foreign keys for referential integrity
- Unique constraints for duplicate prevention

## 🛠️ Environment Configuration

### Backend (.env)
```
PORT=5050
DATABASE_URL=postgresql://postgres:password@localhost:5432/college_event_portal
JWT_SECRET=your_secret_key_here
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5050/api
```

## 📝 Available Scripts

### Backend
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run setup:db` - Initialize database schema
- `npm run load:data` - Load real datasets
- `npm run seed:admin` - Create default admin account

### Frontend
- `npm run dev` - Start dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Root
- `npm run dev` - Start both backend and frontend concurrently

## 🎯 What's New

- ✨ Real data integration from Excel and CSV files
- ✨ Attendance tracking table for participation records
- ✨ Enhanced dashboard with aggregated analytics
- ✨ Leaderboard view for top performers
- ✨ Duplicate prevention on key fields
- ✨ Department name normalization
- ✨ Improved database indexes for analytics queries

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database user permissions

### Data Loading Issues
- Ensure data files exist in `data/` folder
- Check file names match exactly
- Verify Excel files are not corrupted

### Frontend Shows No Data
- Check browser console for errors
- Verify API endpoint in Network tab
- Ensure auth token is stored (check localStorage)
- Check backend is running on port 5050

## 📈 Performance

- Optimized queries with strategic indexing
- Pagination support on large datasets
- Efficient frontend API calls with Axios
- Real-time data updates
- Responsive UI with Tailwind CSS

## 🚀 Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database URL
4. Update `CLIENT_ORIGIN` with production domain
5. Set HTTPS for secure connections
6. Use environment-specific variables

## 📄 License

This project is part of a college event management system.

## 🤝 Support

For issues or questions:
1. Check INTEGRATION_GUIDE.md for setup help
2. Review DATA_INTEGRATION_SUMMARY.md for architecture details
3. Check browser DevTools console for error messages
4. Verify all configuration files are properly set

---

**Status**: ✅ Production Ready
**Last Updated**: April 2026
**Version**: 1.0.0 (Real Data Integration Complete)

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
