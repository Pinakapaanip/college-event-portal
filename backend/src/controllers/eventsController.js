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

  const result = store.listEvents({ 
    q, departmentId, category, from, to, page, limit, sort, order 
  });
  
  res.json(result);
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

  const event = store.createEvent({ 
    title, category, department_id, date, venue, organizer, description 
  });
  res.status(201).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const { title, category, department_id, date, venue, organizer, description = '' } = req.body;
  // TODO: Implement database update
  return res.status(501).json({ message: 'Update not yet implemented for database.' });
});

const deleteEvent = asyncHandler(async (req, res) => {
  // TODO: Implement database delete
  return res.status(501).json({ message: 'Delete not yet implemented for database.' });
});

const exportEventsCsv = asyncHandler(async (req, res) => {
  const events = store.listEvents({ limit: 10000 });
  
  // Generate CSV
  const headers = ['id', 'title', 'category', 'department_name', 'date', 'venue', 'organizer'];
  const rows = events.data.map(event => [
    event.id,
    event.title,
    event.category,
    event.department_name,
    event.date,
    event.venue,
    event.organizer
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="events.csv"');
  res.send(csv);
});

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent, exportEventsCsv };
