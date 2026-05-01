const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await db.getAllDepartments();
  res.json(departments);
});

module.exports = { getDepartments };
