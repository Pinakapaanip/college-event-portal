const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

function isLocalDatabaseUrl(connectionString) {
  if (!connectionString) return false;

  try {
    const { hostname } = new URL(connectionString);
    return ['localhost', '127.0.0.1'].includes(hostname);
  } catch (error) {
    return false;
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl && !isLocalDatabaseUrl(databaseUrl) ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
module.exports.pool = pool;
