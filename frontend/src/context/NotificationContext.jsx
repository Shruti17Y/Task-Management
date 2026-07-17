import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { TaskContext } from './TaskContext';
import { fetchFromAPI } from '../services/api';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const taskContext = useContext(TaskContext); // Optional, so we don't crash if TaskProvider isn't parent
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Computed unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = async () => {
    if (!user) return;
    setLoadingNotifications(true);
    try {
      const data = await fetchFromAPI('/notifications');
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetchFromAPI('/notifications/mark-read', { method: 'PUT' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error.message);
      // Revert if error
      loadNotifications();
    }
  };

  const markAsRead = async (id) => {
    if (!user) return;
    // Optimistic update
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await fetchFromAPI(`/notifications/${id}/read`, { method: 'PUT' });
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error.message);
      // Revert if error
      loadNotifications();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Load notifications and connect SSE stream on user login
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsSidebarOpen(false);
      return;
    }

    // Load existing notifications
    loadNotifications();

    // Setup EventSource for SSE real-time streaming
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const streamUrl = `${API_BASE_URL}/notifications/stream?token=${token}`;

    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        
        // Append notification to state
        setNotifications(prev => {
          // Prevent duplicates if connection flapped
          if (prev.some(n => n._id === newNotification._id)) return prev;
          return [newNotification, ...prev];
        });

        // Trigger background task reload to keep board fresh!
        if (taskContext && typeof taskContext.loadTasks === 'function') {
          taskContext.loadTasks();
        }
      } catch (err) {
        console.error('Error parsing SSE event data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection error. Retrying...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [user, taskContext]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isSidebarOpen,
      setIsSidebarOpen,
      loadingNotifications,
      loadNotifications,
      markAllAsRead,
      markAsRead,
      toggleSidebar,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default useNotifications;
