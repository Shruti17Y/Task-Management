import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = ({ setView, currentView, theme, toggleTheme }) => {
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
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

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
