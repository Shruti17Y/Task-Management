import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = ({ setView, currentView }) => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, toggleSidebar } = useNotifications();

  return (
    <nav className="navbar">
      <div 
        className="navbar-brand" 
        onClick={() => !user && setView('login')} 
        style={{ cursor: user ? 'default' : 'pointer' }}
      >
        Task Manager
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <span style={{ fontSize: '14px', color: 'var(--text)', marginRight: '8px' }}>
              Logged in as <strong>{user.name}</strong>
            </span>
            {user.email !== 'admin@example.com' && (
              <button 
                className="nav-notification-btn" 
                onClick={toggleSidebar}
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
            )}
            <button className="nav-button-solid" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              className="nav-link" 
              onClick={() => setView('login')}
              style={currentView === 'login' ? { fontWeight: '700', color: 'var(--text-h)', background: 'var(--code-bg)' } : {}}
            >
              Login
            </button>
            <button 
              className="nav-link" 
              onClick={() => setView('register')}
              style={currentView === 'register' ? { fontWeight: '700', color: 'var(--text-h)', background: 'var(--code-bg)' } : {}}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
