const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');

const getSummary = asyncHandler(async (req, res) => {
  const stats = await db.getDashboardStats();
  res.json(stats);
});

const getEventsByDepartment = asyncHandler(async (req, res) => {
  const data = await db.getEventsByDepartment();
  res.json(data);
});

const getMonthlyTrend = asyncHandler(async (req, res) => {
  const data = await db.getMonthlyTrends();
  res.json(data);
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const data = await db.getCategoryDistribution();
  res.json(data);
});

const getParticipantMix = asyncHandler(async (req, res) => {
  const data = await db.getParticipantsByType();
  res.json(data);
});

const getTopDepartments = asyncHandler(async (req, res) => {
  const data = await db.getTopDepartments();
  res.json(data);
});

const getWinnersLeaderboard = asyncHandler(async (req, res) => {
  const data = await db.getLeaderboard();
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
