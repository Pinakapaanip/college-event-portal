const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const getDepartments = asyncHandler(async (req, res) => {
  res.json(store.getDepartments());
});

module.exports = { getDepartments };
