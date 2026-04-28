-- ==========================================
-- ANALYTICAL SQL QUERIES FOR COLLEGE EVENT PORTAL
-- Academic data extraction and reporting queries
-- ==========================================

-- ==========================================
-- Query 1: EVENTS PER DEPARTMENT
-- Purpose: Count total events organized by each department
-- Use Case: Identify which departments are most active
-- ==========================================
SELECT 
  d.department_name,
  COUNT(e.id) AS total_events,
  MAX(e.date) AS latest_event_date,
  MIN(e.date) AS earliest_event_date
FROM departments d
LEFT JOIN events e ON d.id = e.department_id
GROUP BY d.id, d.department_name
ORDER BY total_events DESC;


-- ==========================================
-- Query 2: CATEGORY DISTRIBUTION
-- Purpose: Analyze event breakdown by category
-- Use Case: Understand the distribution of event types
-- ==========================================
SELECT 
  e.category,
  COUNT(e.id) AS event_count,
  COUNT(DISTINCT e.department_id) AS departments_involved,
  ROUND(
    COUNT(e.id)::NUMERIC / SUM(COUNT(e.id)) OVER () * 100, 2
  ) AS percentage_of_total
FROM events e
GROUP BY e.category
ORDER BY event_count DESC;


-- ==========================================
-- Query 3: MONTHLY EVENT TREND
-- Purpose: Track event volume over time by month
-- Use Case: Identify seasonal patterns and event frequency trends
-- ==========================================
SELECT 
  DATE_TRUNC('month', e.date)::DATE AS month,
  COUNT(e.id) AS event_count,
  COUNT(DISTINCT e.department_id) AS unique_departments,
  AVG(COUNT(e.id)) OVER (
    ORDER BY DATE_TRUNC('month', e.date)
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg_3month
FROM events e
GROUP BY DATE_TRUNC('month', e.date)
ORDER BY month ASC;


-- ==========================================
-- Query 4: PARTICIPANTS PER DEPARTMENT
-- Purpose: Count participant enrollment by department
-- Use Case: Measure departmental participation levels
-- ==========================================
SELECT 
  d.department_name,
  COUNT(p.id) AS total_participants,
  COUNT(DISTINCT p.event_id) AS events_attended,
  ROUND(COUNT(p.id)::NUMERIC / COUNT(DISTINCT p.event_id), 2) AS avg_participants_per_event
FROM departments d
LEFT JOIN events e ON d.id = e.department_id
LEFT JOIN participants p ON e.id = p.event_id
GROUP BY d.id, d.department_name
ORDER BY total_participants DESC;


-- ==========================================
-- Query 5: INTERNAL VS EXTERNAL PARTICIPANTS
-- Purpose: Compare internal student vs external participant split
-- Use Case: Understand participation mix and engagement patterns
-- ==========================================
SELECT 
  e.category,
  p.participant_type,
  COUNT(p.id) AS participant_count,
  ROUND(
    COUNT(p.id)::NUMERIC / SUM(COUNT(p.id)) OVER (PARTITION BY e.category) * 100, 2
  ) AS percentage_within_category
FROM events e
JOIN participants p ON e.id = p.event_id
GROUP BY e.category, p.participant_type
ORDER BY e.category ASC, participant_count DESC;


-- ==========================================
-- Query 6: TOP WINNERS BY FREQUENCY
-- Purpose: Identify most frequently winning participants
-- Use Case: Recognize high-performing participants
-- ==========================================
SELECT 
  p.student_name,
  p.roll_no,
  p.department,
  COUNT(r.id) AS total_wins,
  COUNT(DISTINCT r.rank) AS distinct_ranks,
  AVG(r.rank) AS average_rank,
  STRING_AGG(DISTINCT e.category, ', ') AS categories_won
FROM participants p
JOIN results r ON p.id = r.participant_id
JOIN events e ON r.event_id = e.id
GROUP BY p.id, p.student_name, p.roll_no, p.department
HAVING COUNT(r.id) > 0
ORDER BY total_wins DESC, average_rank ASC
LIMIT 20;


-- ==========================================
-- Query 7: DEPARTMENT PERFORMANCE SCORECARD
-- Purpose: Multi-metric performance analysis by department
-- Use Case: Comprehensive departmental statistics and rankings
-- ==========================================
SELECT 
  d.department_name,
  COUNT(DISTINCT e.id) AS events_organized,
  COUNT(DISTINCT p.id) AS total_participants,
  SUM(CASE WHEN p.participant_type = 'internal' THEN 1 ELSE 0 END) AS internal_count,
  SUM(CASE WHEN p.participant_type = 'external' THEN 1 ELSE 0 END) AS external_count,
  COUNT(DISTINCT r.id) AS total_winners,
  ROUND(
    COUNT(DISTINCT r.id)::NUMERIC / COUNT(DISTINCT p.id) * 100, 2
  ) AS winning_percentage
FROM departments d
LEFT JOIN events e ON d.id = e.department_id
LEFT JOIN participants p ON e.id = p.event_id
LEFT JOIN results r ON p.id = r.participant_id
GROUP BY d.id, d.department_name
ORDER BY events_organized DESC, total_participants DESC;


-- ==========================================
-- Query 8: CATEGORY PERFORMANCE ANALYSIS
-- Purpose: Detailed performance metrics per event category
-- Use Case: Assess popularity and participation in each event type
-- ==========================================
SELECT 
  e.category,
  COUNT(DISTINCT e.id) AS total_events,
  COUNT(DISTINCT p.id) AS unique_participants,
  COUNT(DISTINCT e.department_id) AS departments_hosting,
  AVG(COUNT(p.id)) OVER (PARTITION BY e.category) AS avg_participants_per_event,
  MIN(e.date) AS first_event,
  MAX(e.date) AS recent_event
FROM events e
LEFT JOIN participants p ON e.id = p.event_id
GROUP BY e.category
ORDER BY total_events DESC;
