const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const getSummary = asyncHandler(async (req, res) => {
  res.json(store.getSummary());
});

const getEventsByDepartment = asyncHandler(async (req, res) => {
  res.json(store.getEventsByDepartment());
});

const getMonthlyTrend = asyncHandler(async (req, res) => {
  res.json(store.getMonthlyTrend());
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  res.json(store.getCategoryBreakdown());
});

const getParticipantMix = asyncHandler(async (req, res) => {
  res.json(store.getParticipantMix());
});

const getTopDepartments = asyncHandler(async (req, res) => {
  res.json(store.getTopDepartments());
});

const getWinnersLeaderboard = asyncHandler(async (req, res) => {
  res.json(store.getWinnersLeaderboard());
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
