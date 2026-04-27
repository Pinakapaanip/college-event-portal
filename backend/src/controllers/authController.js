const store = require('../services/demoStore');
const { signToken } = require('../utils/tokens');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const user = store.registerUser({ name, email, password, role });
    const token = signToken(user);
    return res.status(201).json({ user, token });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ message: error.message });
    }

    throw error;
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await store.loginUser({ email, password });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = signToken(user);
  res.json({ user, token });
});

module.exports = { register, login };
