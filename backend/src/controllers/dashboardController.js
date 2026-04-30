const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const getSummary = asyncHandler(async (req, res) => {
  const stats = store.getSummary();
  res.json(stats);
});

const getEventsByDepartment = asyncHandler(async (req, res) => {
  const data = store.getEventsByDepartment();
  res.json(data);
});

const getMonthlyTrend = asyncHandler(async (req, res) => {
  const data = store.getMonthlyTrend();
  res.json(data);
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const data = store.getCategoryBreakdown();
  res.json(data);
});

const getParticipantMix = asyncHandler(async (req, res) => {
  const data = store.getParticipantMix();
  res.json(data);
});

const getTopDepartments = asyncHandler(async (req, res) => {
  const data = store.getTopDepartments();
  res.json(data);
});

const getWinnersLeaderboard = asyncHandler(async (req, res) => {
  const data = store.getWinnersLeaderboard();
  res.json(data);
});

module.exports = {
  getSummary,
  getEventsByDepartment,
  getMonthlyTrend,
  getCategoryBreakdown,
  getParticipantMix,
  getTopDepartments,
  getWinnersLeaderboard,
};
