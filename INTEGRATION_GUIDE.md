# College Event Statistics Portal - Integration Guide

This guide explains how to complete the real data integration with your existing portal.

## Prerequisites

Make sure you have:
- PostgreSQL running locally (or configured in DATABASE_URL)
- Node.js and npm installed
- The project folder structure intact

## Setup Steps

### Step 1: Database Configuration

1. **Configure the database connection** in `backend/.env`:
   ```
   PORT=5050
   DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/college_event_portal
   JWT_SECRET=your_secret_key_here
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

2. **Create the database** (if it doesn't exist):
   ```bash
   createdb college_event_portal
   ```

3. **Initialize the schema**:
   ```bash
   cd backend
   npm run setup:db
   ```
   
   This will create all tables, indexes, and constraints.

### Step 2: Load Real Data

Once the database is set up, load the Excel/CSV datasets:

```bash
cd backend
npm run load:data
```

This will:
- Read events from `data/events (5).csv`
- Read participants from `data/final_matched_participants.xlsx`
- Read participation records from `data/updated_participation.xlsx`
- Read results from `data/results.csv`
- Insert everything into PostgreSQL with duplicate prevention

### Step 3: Seed Admin Account

Create the default admin account:

```bash
cd backend
npm run seed:admin
```

Credentials:
- Email: `admin@college.edu`
- Password: `password123`

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 5: Start the Application

From the root directory:

```bash
npm run dev
```

This will start both backend (port 5050) and frontend (port 5173).

## Architecture Changes

### Backend Changes

1. **New Database Service** (`backend/src/services/dbService.js`):
   - Replaces in-memory `demoStore` with real PostgreSQL queries
   - Provides functions for all CRUD operations
   - Includes dashboard analytics queries

2. **Updated Controllers**:
   - `eventsController` - Uses real database
   - `participantsController` - Uses real database
   - `resultsController` - Uses real database + new leaderboard endpoint
   - `dashboardController` - Uses real database analytics
   - `departmentsController` - Uses real database

3. **New Data Loading Script** (`backend/src/scripts/loadData.js`):
   - Reads Excel files using xlsx library
   - Parses CSV files
   - Normalizes department names
   - Prevents duplicate entries
   - Maintains referential integrity

4. **New Database Setup Script** (`backend/src/scripts/setupDb.js`):
   - Creates PostgreSQL schema
   - Sets up tables and indexes
   - Ready for data loading

5. **Updated Database Schema**:
   - Added `participation` table for attendance tracking
   - Added indexes for analytics queries
   - Maintained all existing relationships

### Frontend Integration

The frontend already has all necessary API integration:

- **Dashboard Page** - Displays:
  - Total Events, Participants, Departments, Upcoming Events
  - Events by Department (bar chart)
  - Monthly Event Trends (line chart)
  - Category Distribution (doughnut chart)
  - Internal vs External Participants (pie chart)

- **Events Page** - Features:
  - Filter by department and category
  - Search by title, venue, or organizer
  - Date range filtering
  - Sorting and pagination

- **Participants Page** - Shows:
  - Participants per event
  - Add new participants with duplicate prevention

- **Results Page** - Displays:
  - Event results and leaderboard
  - Ranked results with prizes

## API Endpoints

### Events
- `GET /events` - List all events with filters
- `GET /events/:id` - Get event details
- `POST /events` - Create new event (admin only)

### Participants
- `GET /participants/event/:eventId` - Get participants for an event
- `POST /participants` - Add participant (admin only)

### Results
- `GET /results` - Get results for an event
- `GET /results/leaderboard` - Get leaderboard
- `POST /results` - Add result (admin only)

### Dashboard
- `GET /dashboard/summary` - Summary statistics
- `GET /dashboard/events-by-department` - Events per department
- `GET /dashboard/monthly-trend` - Monthly event trends
- `GET /dashboard/category-breakdown` - Event category distribution
- `GET /dashboard/participant-mix` - Internal vs external split
- `GET /dashboard/top-departments` - Top departments by participation
- `GET /dashboard/winners-leaderboard` - Top winners

### Departments
- `GET /departments` - List all departments

## Data Loading Details

### Events Table
- Reads from: `data/events (5).csv`
- Maps: event_name → title
- Normalizes: department names to match database values

### Participants Table
- Reads from: `data/final_matched_participants.xlsx`
- Prevents: duplicate roll_no entries
- Maintains: internal/external classification

### Participation Table
- Reads from: `data/updated_participation.xlsx`
- Tracks: attendance status (attended, registered, absent)
- Enforces: one record per participant per event

### Results Table
- Reads from: `data/results.csv`
- Maintains: rank uniqueness per event
- Links: participants to results with prizes

## Troubleshooting

### Database Connection Fails
- Check PostgreSQL is running: `psql -U postgres`
- Verify DATABASE_URL in `.env` file
- Ensure database user has permissions

### Data Load Fails
- Verify Excel/CSV files exist in `data/` folder
- Check file names match exactly:
  - `events (5).csv`
  - `final_matched_participants.xlsx`
  - `updated_participation.xlsx`
  - `results.csv`

### API Returns 500 Errors
- Check backend console for specific error messages
- Verify database tables are created: `npm run setup:db`
- Check database connection in `.env`

### Frontend Shows No Data
- Open browser DevTools Console for errors
- Check Network tab - verify API calls reach backend
- Verify auth token is stored (check localStorage)

## Next Steps

1. **Customize Theme** (if needed):
   - Edit `frontend/src/context/ThemeContext.jsx`
   - Update `frontend/src/config/brand.js`

2. **Add More Fields** (if needed):
   - Update database schema
   - Add migrations
   - Update API endpoints

3. **Deploy**:
   - Set production environment variables
   - Use environment-specific database
   - Configure JWT secret for production
   - Update CLIENT_ORIGIN for production domain

## Support

For issues or questions:
1. Check the console output for specific error messages
2. Verify all configuration files (.env, database.sql)
3. Ensure all dependencies are installed
4. Check data files are in the correct format
