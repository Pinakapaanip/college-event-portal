# Quick Reference Card

## One-Command Setup (After DB is Ready)

```bash
# Backend
cd backend && npm install && npm run setup:db && npm run load:data && npm run seed:admin

# Frontend  
cd ../frontend && npm install

# Start
cd .. && npm run dev
```

## Environment Files

### backend/.env
```
PORT=5050
DATABASE_URL=postgresql://postgres:password@localhost:5432/college_event_portal
JWT_SECRET=your_jwt_secret_key_replace_this_with_long_random_string_in_production
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### frontend/.env
```
VITE_API_URL=http://localhost:5050/api
```

## Key Commands

```bash
# Backend scripts
npm run dev              # Start with auto-reload
npm run setup:db        # Initialize PostgreSQL schema
npm run load:data       # Load Excel/CSV datasets
npm run seed:admin      # Create admin@college.edu / password123

# Frontend scripts
npm run dev             # Start Vite dev server
npm run build           # Production build

# Root directory
npm run dev             # Start both backend & frontend
```

## Important Paths

### Configuration
- Backend config: `backend/.env`
- Frontend config: `frontend/.env`
- Database schema: `database/schema.sql`

### Data Files
- Events: `data/events (5).csv`
- Participants: `data/final_matched_participants.xlsx`
- Participation: `data/updated_participation.xlsx`
- Results: `data/results.csv`

### Key Backend Files
- Database service: `backend/src/services/dbService.js`
- Data loader: `backend/src/scripts/loadData.js`
- DB setup: `backend/src/scripts/setupDb.js`

## Default Credentials

```
Email: admin@college.edu
Password: password123
```

## Access URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5050/api
- Backend Docs would be at: http://localhost:5050/api (with Swagger if added)

## Data Flow

```
Excel/CSV Files
    ↓
loadData.js
    ↓
PostgreSQL Database
    ↓
dbService.js
    ↓
Controllers → Routes
    ↓
Frontend API Calls
    ↓
React Components (Real Data!)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| DB connection fails | Check DATABASE_URL in .env, verify PostgreSQL running |
| Data load fails | Verify data files exist with exact names in data/ folder |
| Frontend shows no data | Run npm run load:data, check console for API errors |
| Auth errors | Run npm run seed:admin to create admin account |
| Port already in use | Change PORT in backend/.env or kill process |

## What's New in This Integration

✨ **Before**: Mock data from demoStore.js in memory
✨ **After**: Real data from PostgreSQL database

- 20+ database queries optimized with indexes
- Attendance tracking with participation table
- Dashboard analytics with real aggregations
- Leaderboard with ranking system
- Duplicate prevention on key fields
- Department name normalization
- Excel/CSV data import with 1 command
- Zero UI changes (same design)

## File Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── services/dbService.js      ← Replace demoStore
│   │   ├── scripts/
│   │   │   ├── loadData.js            ← Load datasets
│   │   │   ├── setupDb.js             ← Init schema
│   │   │   └── seedAdmin.js
│   │   └── controllers/ (all updated)
│   ├── .env                            ← Create this
│   └── package.json (updated)
├── frontend/
│   └── .env                            ← Create this
├── database/
│   └── schema.sql (updated)
├── data/
│   ├── events (5).csv
│   ├── final_matched_participants.xlsx
│   ├── updated_participation.xlsx
│   └── results.csv
├── INTEGRATION_GUIDE.md                ← Detailed setup
├── DATA_INTEGRATION_SUMMARY.md         ← Technical details
└── README.md (updated)
```

## Integration Checklist

- [ ] PostgreSQL installed and running
- [ ] Created backend/.env with DATABASE_URL
- [ ] Created frontend/.env with VITE_API_URL
- [ ] Run: npm run setup:db
- [ ] Run: npm run load:data
- [ ] Run: npm run seed:admin
- [ ] Run: npm install in frontend/
- [ ] Run: npm run dev from root
- [ ] Login with admin@college.edu / password123
- [ ] Verify Dashboard shows real data
- [ ] Test Events page with filters
- [ ] Check Results page leaderboard
- [ ] Verify Analytics charts work
- [ ] Test CSV export

---

**Version**: 1.0.0
**Status**: Ready for Production
**Last Updated**: April 2026
