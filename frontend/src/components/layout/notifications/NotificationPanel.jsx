import { useState, useEffect } from 'react';
import { notificationAPI } from '../../../services/api';
import NotificationItem from './NotificationItem';
import './NotificationBell.css';

const NotificationPanel = ({ onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-bell-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications({
        limit,
        skip,
      });

      setNotifications(response.notifications || []);
      setHasMore(response.hasMore || false);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const newSkip = skip + limit;
      const response = await notificationAPI.getNotifications({
        limit,
        skip: newSkip,
      });

      setNotifications([...notifications, ...(response.notifications || [])]);
      setHasMore(response.hasMore || false);
      setSkip(newSkip);
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();

      // Update all notifications to read state
      setNotifications(notifications.map(n => ({ ...n, read: true })));

      // Notify parent to refresh unread count
      onNotificationRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await notificationAPI.markAsRead(notification._id);

        // Update notification to read state
        setNotifications(notifications.map(n =>
          n._id === notification._id ? { ...n, read: true } : n
        ));

        // Notify parent to refresh unread count
        onNotificationRead();
      }

      // Navigate to link if provided
      if (notification.link) {
        window.location.href = notification.link;
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);

      // Remove from list
      setNotifications(notifications.filter(n => n._id !== notificationId));

      // Notify parent to refresh unread count
      onNotificationRead();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationAPI.deleteAllNotifications();

      // Clear list
      setNotifications([]);

      // Notify parent to refresh unread count
      onNotificationRead();
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  return (
    <div className="notification-panel">
      {/* Header */}
      <div className="notification-panel-header">
        <h3 className="notification-panel-title">Notifications</h3>
        <div className="notification-panel-actions">
          {notifications.length > 0 && notifications.some(n => !n.read) && (
            <button
              className="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="clear-all-btn"
              onClick={handleClearAll}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {loading && notifications.length === 0 ? (
          <div className="notification-loading">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="empty-icon"
            >
              <path
                d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="empty-text">No notifications yet</p>
            <p className="empty-subtext">We'll notify you when something important happens</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDelete={() => handleDelete(notification._id)}
              />
            ))}

            {hasMore && (
              <button
                className="load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
