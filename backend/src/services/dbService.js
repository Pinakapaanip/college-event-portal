const pool = require('../config/db');

/**
 * Database service for real PostgreSQL queries
 * Replaces the in-memory demoStore with production-ready database operations
 */

function normalizeDatabaseError(error) {
  if (error.statusCode) return error;

  if (error.code === '23503') {
    error.statusCode = 400;
    error.message = 'Selected event or participant does not exist.';
  } else if (error.code === '23514') {
    error.statusCode = 400;
    error.message = 'Submitted value does not match the allowed database values.';
  } else if (error.code === '23505') {
    error.statusCode = 409;
    error.message = 'A matching record already exists.';
  } else if (error.code === '22P02') {
    error.statusCode = 400;
    error.message = 'Invalid numeric value submitted.';
  }

  return error;
}

// ===== DEPARTMENTS =====

async function getAllDepartments() {
  try {
    const result = await pool.query(
      'SELECT id, department_name FROM departments ORDER BY department_name'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

// ===== EVENTS =====

async function listEvents(filters = {}) {
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
  } = filters;

  try {
    const values = [];
    const conditions = [];

    if (q) {
      values.push(`%${q.trim()}%`);
      conditions.push(`(e.title ILIKE $${values.length} OR e.venue ILIKE $${values.length} OR e.organizer ILIKE $${values.length})`);
    }
    if (departmentId) {
      values.push(parseInt(departmentId, 10));
      conditions.push(`e.department_id = $${values.length}`);
    }
    if (category) {
      values.push(category.trim());
      conditions.push(`LOWER(e.category) = LOWER($${values.length})`);
    }
    if (from) {
      values.push(from);
      conditions.push(`e.date >= $${values.length}`);
    }
    if (to) {
      values.push(to);
      conditions.push(`e.date <= $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const validSortColumns = ['title', 'category', 'date', 'venue', 'organizer'];
    const sortColumn = validSortColumns.includes(sort) ? `e.${sort}` : 'e.date';
    const sortDirection = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM events e ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated data
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNumber - 1) * pageSize;

    const query = `
      SELECT e.id, e.title, e.category, e.department_id, d.department_name, 
             e.date, e.venue, e.organizer, e.description, e.created_at, e.updated_at
      FROM events e
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    values.push(pageSize, offset);

    const result = await pool.query(query, values);

    return {
      data: result.rows,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    };
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
}

async function getEventById(id) {
  try {
    const result = await pool.query(
      `SELECT e.id, e.title, e.category, e.department_id, d.department_name, 
              e.date, e.venue, e.organizer, e.description, e.created_at, e.updated_at
       FROM events e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
}

async function createEvent(payload) {
  const { title, category, department_id, date, venue, organizer, description } = payload;
  try {
    const result = await pool.query(
      `INSERT INTO events (title, category, department_id, date, venue, organizer, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, category, department_id, date, venue, organizer, description, created_at`,
      [title, category, department_id, date, venue, organizer, description || null]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// ===== PARTICIPANTS =====

async function getParticipantsByEvent(eventId) {
  try {
    const result = await pool.query(
      `SELECT id, event_id, student_name, roll_no, department, year, participant_type, created_at
       FROM participants
       WHERE event_id = $1
       ORDER BY student_name`,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching participants by event:', error);
    throw error;
  }
}

async function addParticipant(payload) {
  const { event_id, student_name, roll_no, department, year, participant_type } = payload;
  try {
    const existing = await pool.query(
      'SELECT id FROM participants WHERE event_id = $1 AND LOWER(roll_no) = LOWER($2)',
      [event_id, roll_no]
    );

    if (existing.rows.length > 0) {
      const error = new Error('Participant with this roll number already exists for this event');
      error.statusCode = 409;
      throw error;
    }

    const result = await pool.query(
      `INSERT INTO participants (event_id, student_name, roll_no, department, year, participant_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, event_id, student_name, roll_no, department, year, participant_type, created_at`,
      [event_id, student_name, roll_no, department, year, participant_type]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding participant:', error);
    throw normalizeDatabaseError(error);
  }
}

async function getParticipantById(id) {
  try {
    const result = await pool.query(
      'SELECT id, event_id, student_name, roll_no, department, year, participant_type FROM participants WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching participant:', error);
    throw error;
  }
}

// ===== RESULTS =====

async function getResults(eventId) {
  try {
    let query = `
      SELECT r.id, r.event_id, r.participant_id, r.rank, r.prize, r.created_at,
             p.student_name, p.roll_no, p.department
      FROM results r
      LEFT JOIN participants p ON r.participant_id = p.id
    `;
    const params = [];

    if (eventId) {
      query += ` WHERE r.event_id = $1`;
      params.push(eventId);
    }

    query += ` ORDER BY r.rank ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}

async function getLeaderboard() {
  try {
    const result = await pool.query(
      `SELECT r.id, r.event_id, r.participant_id, r.rank, r.prize,
              p.student_name, p.roll_no, p.department, e.title as event_title
       FROM results r
       LEFT JOIN participants p ON r.participant_id = p.id
       LEFT JOIN events e ON r.event_id = e.id
       ORDER BY r.rank ASC
       LIMIT 100`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

async function addResult(payload) {
  const { event_id, participant_id, rank, prize } = payload;
  try {
    // Check for duplicate rank in the same event
    const existing = await pool.query(
      'SELECT id FROM results WHERE event_id = $1 AND rank = $2',
      [event_id, rank]
    );

    if (existing.rows.length > 0) {
      const error = new Error('Result with this rank already exists for this event');
      error.statusCode = 409;
      throw error;
    }

    const result = await pool.query(
      `INSERT INTO results (event_id, participant_id, rank, prize)
       VALUES ($1, $2, $3, $4)
       RETURNING id, event_id, participant_id, rank, prize, created_at`,
      [event_id, participant_id, rank, prize]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding result:', error);
    throw normalizeDatabaseError(error);
  }
}

// ===== PARTICIPATION =====

async function getParticipationStats() {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(CASE WHEN status = 'attended' THEN 1 END) as attended,
         COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
         COUNT(CASE WHEN status = 'registered' THEN 1 END) as registered,
         COUNT(*) as total
       FROM participation`
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching participation stats:', error);
    throw error;
  }
}

// ===== DASHBOARD ANALYTICS =====

async function getDashboardStats() {
  try {
    const totalEventsResult = await pool.query('SELECT COUNT(*) as count FROM events');
    const totalParticipantsResult = await pool.query('SELECT COUNT(*) as count FROM participants');
    const totalDepartmentsResult = await pool.query('SELECT COUNT(*) as count FROM departments');
    const upcomingEventsResult = await pool.query(
      'SELECT COUNT(*) as count FROM events WHERE date >= CURRENT_DATE'
    );

    return {
      totalEvents: parseInt(totalEventsResult.rows[0].count, 10),
      totalParticipants: parseInt(totalParticipantsResult.rows[0].count, 10),
      totalDepartments: parseInt(totalDepartmentsResult.rows[0].count, 10),
      upcomingEvents: parseInt(upcomingEventsResult.rows[0].count, 10),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

async function getEventsByDepartment() {
  try {
    const result = await pool.query(
      `SELECT d.department_name, COUNT(e.id) as total
       FROM departments d
       LEFT JOIN events e ON d.id = e.department_id
       GROUP BY d.id, d.department_name
       ORDER BY total DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching events by department:', error);
    throw error;
  }
}

async function getMonthlyTrends() {
  try {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(e.date, 'YYYY-MM') as month,
         COUNT(e.id) as total
       FROM events e
       GROUP BY TO_CHAR(e.date, 'YYYY-MM')
       ORDER BY month DESC
       LIMIT 12`
    );
    return result.rows.reverse();
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    throw error;
  }
}

async function getCategoryDistribution() {
  try {
    const result = await pool.query(
      `SELECT category, COUNT(*) as total
       FROM events
       GROUP BY category
       ORDER BY total DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    throw error;
  }
}

async function getParticipantsByType() {
  try {
    const result = await pool.query(
      `SELECT participant_type, COUNT(*) as total
       FROM participants
       GROUP BY participant_type`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching participants by type:', error);
    throw error;
  }
}

async function getTopDepartments() {
  try {
    const result = await pool.query(
      `SELECT p.department, COUNT(p.id) as total
       FROM participants p
       GROUP BY p.department
       ORDER BY total DESC
       LIMIT 10`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching top departments:', error);
    throw error;
  }
}

module.exports = {
  // Departments
  getAllDepartments,
  
  // Events
  listEvents,
  getEventById,
  createEvent,
  
  // Participants
  getParticipantsByEvent,
  addParticipant,
  getParticipantById,
  
  // Results
  getResults,
  getLeaderboard,
  addResult,
  
  // Participation
  getParticipationStats,
  
  // Dashboard
  getDashboardStats,
  getEventsByDepartment,
  getMonthlyTrends,
  getCategoryDistribution,
  getParticipantsByType,
  getTopDepartments,
};
