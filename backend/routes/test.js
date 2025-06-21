const express = require('express');
const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;