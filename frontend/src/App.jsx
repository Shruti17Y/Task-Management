import React, { useContext, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './App.css';

function MainApp() {
  const { user, loading } = useContext(AuthContext);
  const [view, setView] = useState('login'); // 'login' | 'register'

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
      <Navbar setView={setView} currentView={view} />
      <main>
        {user ? (
          <Dashboard />
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
      <MainApp />
    </AuthProvider>
  );
}

export default App;
