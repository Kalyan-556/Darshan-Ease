import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaCheck, FaTrash, FaInbox } from 'react-icons/fa';
import api from '../services/api';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch user notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      if (response.data.success) {
        // Refresh local lists
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <div className="notifications-page container">
      <div className="notifications-card-container glass-card">
        <div className="notifications-header-title">
          <FaBell className="header-bell-icon" />
          <h2>My Notifications</h2>
        </div>

        {loading ? (
          <p>Loading your notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="empty-notifications text-center">
            <FaInbox className="inbox-icon" />
            <h3>All Caught Up!</h3>
            <p>You do not have any new notifications at this time.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notif => (
              <div key={notif._id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                <div className="notif-body">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <span className="notif-date">{new Date(notif.date).toLocaleString()}</span>
                </div>
                {!notif.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="btn-mark-read"
                    title="Mark as Read"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
