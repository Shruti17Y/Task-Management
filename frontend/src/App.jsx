import React, { useContext, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import NotificationSidebar from './components/NotificationSidebar/NotificationSidebar';
import './App.css';

function MainApp() {
  const { user, loading } = useContext(AuthContext);
  const [view, setView] = useState('login'); // 'login' | 'register'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--sans)' }}>
        <div className="status-badge checking">
          <span className="status-dot"></span>
          <span>Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar setView={setView} currentView={view} theme={theme} toggleTheme={toggleTheme} />
      <main>
        {user ? (
          <>
            <Dashboard />
            <NotificationSidebar />
          </>
        ) : view === 'login' ? (
          <Login setView={setView} />
        ) : (
          <Register setView={setView} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <TaskProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </TaskProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
