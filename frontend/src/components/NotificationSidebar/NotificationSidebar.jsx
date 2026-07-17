import React, { useContext, useMemo } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatDate';

const getDiff = (oldTask, newTask) => {
  const diffs = [];
  if (!oldTask || !newTask) return diffs;

  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date', isDate: true }
  ];

  fields.forEach(field => {
    let oldVal = oldTask[field.key];
    let newVal = newTask[field.key];

    if (field.isDate) {
      const oldTime = oldVal ? new Date(oldVal).setHours(0,0,0,0) : null;
      const newTime = newVal ? new Date(newVal).setHours(0,0,0,0) : null;
      if (oldTime !== newTime) {
        diffs.push({
          label: field.label,
          oldValue: oldVal ? new Date(oldVal).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'None',
          newValue: newVal ? new Date(newVal).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'None'
        });
      }
    } else {
      const oldStr = (oldVal !== undefined && oldVal !== null) ? oldVal.toString().trim() : '';
      const newStr = (newVal !== undefined && newVal !== null) ? newVal.toString().trim() : '';
      if (oldStr !== newStr) {
        diffs.push({
          label: field.label,
          oldValue: oldStr || 'None',
          newValue: newStr || 'None'
        });
      }
    }
  });

  return diffs;
};

export const NotificationSidebar = () => {
  const {
    notifications,
    isSidebarOpen,
    setIsSidebarOpen,
    markAllAsRead,
    markAsRead
  } = useContext(NotificationContext);

  if (!isSidebarOpen) return null;

  return (
    <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}>
      <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title-container">
            <h2 className="sidebar-title">Admin Updates</h2>
            <button 
              className="sidebar-close-btn" 
              onClick={() => setIsSidebarOpen(false)}
              title="Close Panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {notifications.some(n => !n.read) && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Content list */}
        <div className="sidebar-body">
          {notifications.length === 0 ? (
            <div className="sidebar-empty">
              <svg className="sidebar-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <h3>All Caught Up</h3>
              <p>No task updates from the admin yet.</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => {
                const diffs = notification.action === 'updated' 
                  ? getDiff(notification.oldTaskDetails, notification.taskDetails)
                  : [];

                return (
                  <div 
                    key={notification._id} 
                    className={`notification-card ${!notification.read ? 'unread' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification._id)}
                  >
                    {/* Action Header badge */}
                    <div className="notification-card-header">
                      <span className={`action-badge ${notification.action}`}>
                        {notification.action === 'added' && 'Task Assigned'}
                        {notification.action === 'updated' && 'Task Updated'}
                        {notification.action === 'deleted' && 'Task Deleted'}
                      </span>
                      <span className="notification-time">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    {/* Task Snapshot */}
                    <div className="notification-task-title">
                      {notification.taskDetails.title}
                    </div>

                    {notification.taskDetails.description && (
                      <p className="notification-task-desc">
                        {notification.taskDetails.description}
                      </p>
                    )}

                    {/* Diff View */}
                    {notification.action === 'updated' && diffs.length > 0 && (
                      <div className="diff-container">
                        <div className="diff-header">Changed Fields:</div>
                        <div className="diff-list">
                          {diffs.map((diff, index) => (
                            <div key={index} className="diff-item">
                              <div className="diff-label">{diff.label}</div>
                              <div className="diff-values">
                                <span className="diff-val-old" title="Previous Value">{diff.oldValue}</span>
                                <span className="diff-arrow">→</span>
                                <span className="diff-val-new" title="New Value">{diff.newValue}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Small action tag for Deleted */}
                    {notification.action === 'deleted' && (
                      <div className="deleted-notice">
                        This task was permanently removed by the admin.
                      </div>
                    )}

                    {/* Small action tag for Added */}
                    {notification.action === 'added' && (
                      <div className="added-details">
                        {notification.taskDetails.priority && (
                          <span className="added-meta">Priority: <strong>{notification.taskDetails.priority}</strong></span>
                        )}
                        {notification.taskDetails.dueDate && (
                          <span className="added-meta">Due: <strong>{new Date(notification.taskDetails.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong></span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
