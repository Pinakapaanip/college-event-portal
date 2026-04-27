const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const { getDepartments } = require('../controllers/departmentsController');

router.get('/', authenticateToken, getDepartments);

module.exports = router;
