const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');
const pool = require('../config/db');

async function resolveDepartmentId(departmentId, departmentName) {
  if (departmentId && Number.isInteger(Number(departmentId))) {
    const existing = await pool.query('SELECT id FROM departments WHERE id = $1', [Number(departmentId)]);
    if (existing.rows[0]) return existing.rows[0].id;
  }

  const name = String(departmentName || departmentId || '').trim();
  if (!name) return null;

  const result = await pool.query(
    `INSERT INTO departments (department_name)
     VALUES ($1)
     ON CONFLICT (department_name) DO UPDATE SET department_name = EXCLUDED.department_name
     RETURNING id`,
    [name]
  );
  return result.rows[0].id;
}

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
  console.log('BODY:', req.body);
  const { title, category, department_id, department, department_name, date, venue, organizer, description = '' } = req.body;
  if (!title || !category || !(department_id || department || department_name) || !date || !venue || !organizer) {
    return res.status(400).json({ message: 'All event fields except description are required.' });
  }

  try {
    const resolvedDepartmentId = await resolveDepartmentId(department_id, department || department_name);
    const result = await pool.query(
      `INSERT INTO events (title, category, department_id, date, venue, organizer, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, category, department_id, date, venue, organizer, description, created_at`,
      [
        String(title).trim(),
        String(category).trim(),
        resolvedDepartmentId,
        date,
        String(venue).trim(),
        String(organizer).trim(),
        description ? String(description).trim() : null,
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('EVENT INSERT ERROR:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
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
