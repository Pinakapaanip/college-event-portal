const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getSummary,
  getEventsByDepartment,
  getMonthlyTrend,
  getCategoryBreakdown,
  getParticipantMix,
  getTopDepartments,
  getWinnersLeaderboard,
} = require('../controllers/dashboardController');

router.get('/summary', authenticateToken, getSummary);
router.get('/events-by-department', authenticateToken, getEventsByDepartment);
router.get('/monthly-trend', authenticateToken, getMonthlyTrend);
router.get('/category-breakdown', authenticateToken, getCategoryBreakdown);
router.get('/participant-mix', authenticateToken, getParticipantMix);
router.get('/top-departments', authenticateToken, getTopDepartments);
router.get('/winners-leaderboard', authenticateToken, getWinnersLeaderboard);

module.exports = router;
