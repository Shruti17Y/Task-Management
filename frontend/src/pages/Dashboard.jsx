import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchFromAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [latency, setLatency] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkConnectivity = async () => {
    setLoading(true);
    setStatus('checking');
    const startTime = Date.now();
    try {
      const data = await fetchFromAPI('/health');
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setDetails(data);
      setStatus('online');
    } catch (error) {
      setLatency(null);
      setDetails(null);
      setStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-header">
        <h1>Welcome, {user ? user.name : 'User'}!</h1>
        <p style={{ color: 'var(--text)', fontSize: '16px' }}>
          This is your central workspace dashboard. Below is the live connection status verification with the backend API.
        </p>
      </div>

      <div className="connectivity-section">
        <div className="connectivity-header">
          <h2 className="connectivity-title">API Connectivity Check</h2>
          <div className={`status-badge ${status}`}>
            <span className="status-dot"></span>
            <span>{status === 'checking' ? 'Checking...' : status === 'online' ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {status === 'offline' && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <span>Could not establish connection to the backend server. Make sure the backend server is running on port 5000.</span>
          </div>
        )}

        {status === 'online' && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            <span>Successfully connected! The frontend and backend are communicating properly.</span>
          </div>
        )}

        <div className="info-grid">
          <div className="info-card">
            <div className="info-label">API Health Status</div>
            <div className={`info-value ${status === 'online' ? 'alert-success' : 'alert-error'}`} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
              {status === 'online' ? 'UP' : status === 'offline' ? 'DOWN' : 'UNKNOWN'}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">Response Latency</div>
            <div className="info-value">
              {latency !== null ? `${latency} ms` : '--'}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">API Base URL</div>
            <div className="info-value mono">
              http://localhost:5000/api
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">Database Configuration</div>
            <div className="info-value">
              {details ? details.database : 'No connection info'}
            </div>
          </div>
        </div>

        {details && (
          <div className="info-card" style={{ marginTop: '20px' }}>
            <div className="info-label">Last API Timestamp</div>
            <div className="info-value">
              {details.timestamp ? new Date(details.timestamp).toLocaleString() : '--'}
            </div>
          </div>
        )}

        <div className="refresh-container">
          <button 
            className="btn-secondary" 
            onClick={checkConnectivity}
            disabled={loading}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ animation: loading ? 'pulse 1s infinite' : 'none', marginRight: '6px' }}
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            {loading ? 'Refreshing...' : 'Check Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
