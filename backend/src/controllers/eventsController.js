const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');

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

  const result = await db.listEvents({ q, departmentId, category, from, to, page, limit, sort, order });
  res.json(result);
});

const getEvent = asyncHandler(async (req, res) => {
  const event = await db.getEventById(req.params.id);
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

  const event = await db.createEvent({
    title,
    category,
    department_id: Number(department_id),
    date,
    venue,
    organizer,
    description,
  });

  res.status(201).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  return res.status(501).json({ message: 'Update not yet implemented.' });
});

const deleteEvent = asyncHandler(async (req, res) => {
  return res.status(501).json({ message: 'Delete not yet implemented.' });
});

const exportEventsCsv = asyncHandler(async (req, res) => {
  const events = await db.listEvents({ limit: 10000, sort: 'date', order: 'desc' });

  const headers = ['id', 'title', 'category', 'department_name', 'date', 'venue', 'organizer'];
  const rows = events.data.map((event) => [
    event.id,
    event.title,
    event.category,
    event.department_name,
    event.date,
    event.venue,
    event.organizer,
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell ?? ''}"`).join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="events.csv"');
  res.send(csv);
});

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent, exportEventsCsv };
