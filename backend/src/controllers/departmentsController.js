const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const getDepartments = asyncHandler(async (req, res) => {
  const departments = store.getDepartments();
  res.json(departments);
});

module.exports = { getDepartments };
