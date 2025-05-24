const express = require('express');
const app = express();

// Define your routes and middleware here
app.get('/api/health', (req, res) => {
  res.json({ message: 'OK' });
});

module.exports = app;