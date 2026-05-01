const router = require('express').Router();
const { addResult, getResults, getLeaderboard } = require('../controllers/resultsController');

router.post('/', addResult);
router.get('/leaderboard', getLeaderboard);
router.get('/', getResults);

module.exports = router;
