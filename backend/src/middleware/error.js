function notFound(req, res) {
  res.status(404).json({ message: 'Route not found.' });
}

function errorHandler(error, req, res, next) {
  const status = error.statusCode || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error.'
    : error.message || 'Internal server error.';

  res.status(status).json({
    message,
  });
}

module.exports = { notFound, errorHandler };
