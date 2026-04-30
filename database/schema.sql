CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  venue VARCHAR(200) NOT NULL,
  organizer VARCHAR(180) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_name VARCHAR(180) NOT NULL,
  roll_no VARCHAR(80) NOT NULL,
  department VARCHAR(150) NOT NULL,
  year VARCHAR(40) NOT NULL,
  participant_type VARCHAR(20) NOT NULL CHECK (participant_type IN ('internal', 'external')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participation (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_id INT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  participation_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('attended', 'registered', 'absent')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, participant_id)
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_id INT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  rank INT NOT NULL CHECK (rank > 0),
  prize VARCHAR(180) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, rank)
);

-- ==========================================
-- INDEXES FOR QUERY OPTIMIZATION
-- Strategic indexes for analytical queries and common lookups
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_events_department_id ON events(department_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_type ON participants(participant_type);
CREATE INDEX IF NOT EXISTS idx_participants_department ON participants(department);
CREATE INDEX IF NOT EXISTS idx_participation_event_id ON participation(event_id);
CREATE INDEX IF NOT EXISTS idx_participation_participant_id ON participation(participant_id);
CREATE INDEX IF NOT EXISTS idx_participation_status ON participation(status);
CREATE INDEX IF NOT EXISTS idx_results_event_id ON results(event_id);
CREATE INDEX IF NOT EXISTS idx_results_participant_id ON results(participant_id);
CREATE INDEX IF NOT EXISTS idx_results_rank ON results(rank);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(department_name);

-- ==========================================
-- COMPOSITE INDEX FOR ANALYTICAL QUERIES
-- Optimizes department + date range queries
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_events_dept_date ON events(department_id, date);

-- ==========================================
-- INITIAL DATA SEEDING
-- ==========================================
INSERT INTO departments (department_name)
VALUES ('Computer Science'), ('Information Technology'), ('Electronics'), ('Mechanical')
ON CONFLICT (department_name) DO NOTHING;
