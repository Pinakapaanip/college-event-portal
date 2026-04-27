const bcrypt = require('bcryptjs');

const adminPasswordHash = bcrypt.hashSync('password123', 12);

const departments = [
  { id: 1, department_name: 'Computer Science' },
  { id: 2, department_name: 'Information Technology' },
  { id: 3, department_name: 'Electronics' },
  { id: 4, department_name: 'Mechanical' },
  { id: 5, department_name: 'Civil' },
];

const users = [
  {
    id: 1,
    name: 'System Admin',
    email: 'admin@college.edu',
    password: adminPasswordHash,
    role: 'admin',
  },
  {
    id: 2,
    name: 'Faculty Coordinator',
    email: 'coordinator@college.edu',
    password: bcrypt.hashSync('password123', 12),
    role: 'user',
  },
];

const events = [
  {
    id: 1,
    title: 'Tech Talk 2026',
    category: 'Seminar',
    department_id: 1,
    date: '2026-04-30',
    venue: 'Auditorium A',
    organizer: 'Computer Science Department',
    description: 'Annual technology talk with guest speakers and student projects.',
    created_at: '2026-04-05T10:00:00.000Z',
    updated_at: '2026-04-05T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Hackathon Sprint',
    category: 'Competition',
    department_id: 2,
    date: '2026-05-08',
    venue: 'Innovation Lab',
    organizer: 'IT Society',
    description: '24-hour coding sprint with collaborative team challenges.',
    created_at: '2026-04-10T09:30:00.000Z',
    updated_at: '2026-04-10T09:30:00.000Z',
  },
  {
    id: 3,
    title: 'Cultural Fest',
    category: 'Festival',
    department_id: 5,
    date: '2026-06-14',
    venue: 'Open Ground',
    organizer: 'Student Council',
    description: 'Multi-stage cultural performances and student exhibitions.',
    created_at: '2026-04-12T11:20:00.000Z',
    updated_at: '2026-04-12T11:20:00.000Z',
  },
  {
    id: 4,
    title: 'Robotics Expo',
    category: 'Exhibition',
    department_id: 3,
    date: '2026-05-20',
    venue: 'Block C Hall',
    organizer: 'Electronics Club',
    description: 'Student-built robots and automation demos.',
    created_at: '2026-04-15T14:15:00.000Z',
    updated_at: '2026-04-15T14:15:00.000Z',
  },
  {
    id: 5,
    title: 'Sports Meet',
    category: 'Sports',
    department_id: 4,
    date: '2026-04-25',
    venue: 'College Stadium',
    organizer: 'Physical Education Department',
    description: 'Track, field, and team sports events across departments.',
    created_at: '2026-04-16T08:40:00.000Z',
    updated_at: '2026-04-16T08:40:00.000Z',
  },
];

const participants = [
  {
    id: 1,
    event_id: 1,
    student_name: 'Aarav Sharma',
    roll_no: 'CS101',
    department: 'Computer Science',
    year: '3rd Year',
    participant_type: 'internal',
    created_at: '2026-04-05T12:00:00.000Z',
  },
  {
    id: 2,
    event_id: 1,
    student_name: 'Riya Patel',
    roll_no: 'IT205',
    department: 'Information Technology',
    year: '2nd Year',
    participant_type: 'internal',
    created_at: '2026-04-05T12:12:00.000Z',
  },
  {
    id: 3,
    event_id: 2,
    student_name: 'Mohit Verma',
    roll_no: 'EC314',
    department: 'Electronics',
    year: '4th Year',
    participant_type: 'external',
    created_at: '2026-04-10T11:00:00.000Z',
  },
  {
    id: 4,
    event_id: 3,
    student_name: 'Sneha Gupta',
    roll_no: 'CV118',
    department: 'Civil',
    year: '1st Year',
    participant_type: 'internal',
    created_at: '2026-04-12T15:20:00.000Z',
  },
  {
    id: 5,
    event_id: 4,
    student_name: 'Aditya Rao',
    roll_no: 'ME210',
    department: 'Mechanical',
    year: '3rd Year',
    participant_type: 'external',
    created_at: '2026-04-15T16:45:00.000Z',
  },
  {
    id: 6,
    event_id: 5,
    student_name: 'Nisha Khan',
    roll_no: 'CS190',
    department: 'Computer Science',
    year: '2nd Year',
    participant_type: 'internal',
    created_at: '2026-04-16T09:10:00.000Z',
  },
];

const results = [
  { id: 1, event_id: 1, participant_id: 1, rank: 1, prize: 'Best Speaker', created_at: '2026-04-05T13:00:00.000Z' },
  { id: 2, event_id: 1, participant_id: 2, rank: 2, prize: 'Runner Up', created_at: '2026-04-05T13:05:00.000Z' },
  { id: 3, event_id: 2, participant_id: 3, rank: 1, prize: 'Hackathon Winner', created_at: '2026-04-10T18:30:00.000Z' },
  { id: 4, event_id: 4, participant_id: 5, rank: 1, prize: 'Robotics Champion', created_at: '2026-04-15T17:30:00.000Z' },
];

module.exports = {
  departments,
  users,
  events,
  participants,
  results,
};
