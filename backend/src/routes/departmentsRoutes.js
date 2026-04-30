const router = require('express').Router();
const { getDepartments } = require('../controllers/departmentsController');

router.get('/', getDepartments);

module.exports = router;
