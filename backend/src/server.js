const app = require('./app');

const PORT = process.env.PORT || 5050;

async function startServer() {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT} in demo mode`);
  });
}

startServer();
