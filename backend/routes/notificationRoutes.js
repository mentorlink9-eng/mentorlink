/* eslint-env node */
const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Specific named routes BEFORE parameterized routes

// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, getUnreadCount);

// @route   GET /api/notifications
// @access  Private
router.get('/', protect, getNotifications);

// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', protect, markAllAsRead);

// @route   PUT /api/notifications/:notificationId/read
// @access  Private
router.put('/:notificationId/read', protect, markAsRead);

// @route   DELETE /api/notifications/all
// @access  Private
router.delete('/all', protect, deleteAllNotifications);

// @route   DELETE /api/notifications/:notificationId
// @access  Private
router.delete('/:notificationId', protect, deleteNotification);

module.exports = router;
