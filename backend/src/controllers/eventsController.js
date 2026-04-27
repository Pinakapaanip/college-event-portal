const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const listEvents = asyncHandler(async (req, res) => {
  const {
    q = '',
    departmentId = '',
    category = '',
    from = '',
    to = '',
    page = 1,
    limit = 10,
    sort = 'date',
    order = 'asc',
  } = req.query;

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (pageNumber - 1) * pageSize;
  const filters = [];
  const values = [];

  if (q) {
    values.push(`%${q.trim()}%`);
    filters.push(`(e.title ILIKE $${values.length} OR e.venue ILIKE $${values.length} OR e.organizer ILIKE $${values.length})`);
  }
  if (departmentId) {
    values.push(departmentId);
    filters.push(`e.department_id = $${values.length}`);
  }
  if (category) {
    values.push(category.trim());
    filters.push(`e.category = $${values.length}`);
  }
  if (from) {
    values.push(from);
    filters.push(`e.date >= $${values.length}`);
  }
  if (to) {
    values.push(to);
    filters.push(`e.date <= $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const sortColumn = ['title', 'category', 'date', 'venue', 'organizer'].includes(sort) ? `e.${sort}` : 'e.date';
  const sortDirection = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  res.json(store.listEvents({ q, departmentId, category, from, to, page: pageNumber, limit: pageSize, sort, order }));
});

const getEvent = asyncHandler(async (req, res) => {
  const event = store.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  res.json(event);
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, category, department_id, date, venue, organizer, description = '' } = req.body;
  if (!title || !category || !department_id || !date || !venue || !organizer) {
    return res.status(400).json({ message: 'All event fields except description are required.' });
  }

  res.status(201).json(store.createEvent({ title, category, department_id, date, venue, organizer, description }));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { title, category, department_id, date, venue, organizer, description = '' } = req.body;
  const event = store.updateEvent(req.params.id, { title, category, department_id, date, venue, organizer, description });
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  res.json(event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  const deleted = store.deleteEvent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  res.json({ message: 'Event deleted successfully.' });
});

const exportEventsCsv = asyncHandler(async (req, res) => {
  const csv = store.exportEventsCsv();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="events.csv"');
  res.send(csv);
});

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent, exportEventsCsv };
