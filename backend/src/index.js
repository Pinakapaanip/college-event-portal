const app = require('./app');

const PORT = process.env.PORT || 5050;

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Missing');

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
