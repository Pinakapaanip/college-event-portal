const router = require('express').Router();
const { requireRole } = require('../middleware/auth');
const { addResult, getResults, getLeaderboard } = require('../controllers/resultsController');

router.post('/', requireRole('admin'), addResult);
router.get('/leaderboard', getLeaderboard);
router.get('/', getResults);

module.exports = router;
