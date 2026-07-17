import React from 'react';

export const ConnectionBadge = ({ connStatus, dbDetails, latency, onCheck }) => {
  return (
    <div 
      className={`status-badge ${connStatus}`} 
      style={styles.connBadgeWrapper} 
      onClick={onCheck}
    >
      <span className="status-dot"></span>
      <span style={styles.connBadgeText}>
        DB: {dbDetails ? dbDetails.database : connStatus === 'checking' ? 'Checking...' : 'Disconnected'}
        {latency ? ` (${latency}ms)` : ''}
      </span>
    </div>
  );
};

const styles = {
  connBadgeWrapper: {
    cursor: 'pointer',
  },
  connBadgeText: {
    fontSize: '13px',
  }
};

export default ConnectionBadge;
