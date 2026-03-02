/* eslint-env node */
const express = require('express');
const { toggleConnection, getConnections, checkConnection } = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Specific named routes BEFORE generic routes

// @route   GET /api/connect/check/:userId
// @access  Private
router.get('/check/:userId', protect, checkConnection);

// @route   GET /api/connect
// @access  Private
router.get('/', protect, getConnections);

// @route   POST /api/connect/:userId
// @access  Private
router.post('/:userId', protect, toggleConnection);

module.exports = router;
