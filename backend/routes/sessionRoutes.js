const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionsWithUser,
  getSessionById,
  updateSessionStatus,
  deleteSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
// Specific named routes BEFORE parameterized routes
router.post('/', protect, createSession);
router.get('/with-user/:userId', protect, getSessionsWithUser);
router.get('/', protect, getSessions);
router.get('/:sessionId', protect, getSessionById);
router.put('/:sessionId/status', protect, updateSessionStatus);
router.delete('/:sessionId', protect, deleteSession);

module.exports = router;
