import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ setView, currentView }) => {
  const { user, logout } = useContext(AuthContext);

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
