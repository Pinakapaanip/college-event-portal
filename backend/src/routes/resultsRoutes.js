const router = require('express').Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { addResult, getResults } = require('../controllers/resultsController');

router.post('/', authenticateToken, requireRole('admin'), addResult);
router.get('/', authenticateToken, getResults);

module.exports = router;
