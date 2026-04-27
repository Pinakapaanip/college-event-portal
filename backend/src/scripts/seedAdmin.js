require('dotenv').config();
const store = require('../services/demoStore');

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || 'System Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@college.edu';
  const password = process.env.ADMIN_PASSWORD || 'password123';

  try {
    store.registerUser({ name, email, password, role: 'admin' });
    console.log(`Admin user created: ${email}`);
  } catch (error) {
    if (error.statusCode === 409) {
      console.log('Admin user already exists.');
      process.exit(0);
    }
    throw error;
  }

  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user:', error.message);
  process.exit(1);
});
