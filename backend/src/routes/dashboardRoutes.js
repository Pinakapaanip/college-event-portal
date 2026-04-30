const router = require('express').Router();
const {
  getSummary,
  getEventsByDepartment,
  getMonthlyTrend,
  getCategoryBreakdown,
  getParticipantMix,
  getTopDepartments,
  getWinnersLeaderboard,
} = require('../controllers/dashboardController');

router.get('/summary', getSummary);
router.get('/events-by-department', getEventsByDepartment);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/participant-mix', getParticipantMix);
router.get('/top-departments', getTopDepartments);
router.get('/winners-leaderboard', getWinnersLeaderboard);

module.exports = router;
