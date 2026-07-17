import React from 'react';
import ConnectionBadge from '../ConnectionBadge/ConnectionBadge';

export const DashboardHeader = ({ user, connStatus, dbDetails, latency, onCheckConnectivity }) => {
  return (
    <div className="welcome-header" style={styles.dashboardHeaderContainer}>
      <div>
        <h1>Welcome, {user ? user.name : 'User'}!</h1>
        <p style={styles.welcomeSubheader}>
          Manage your daily tasks and keep track of project requirements.
        </p>
      </div>

      <ConnectionBadge
        connStatus={connStatus}
        dbDetails={dbDetails}
        latency={latency}
        onCheck={onCheckConnectivity}
      />
    </div>
  );
};

const styles = {
  dashboardHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '32px',
  },
  welcomeSubheader: {
    color: 'var(--text)',
    fontSize: '15px',
    margin: '4px 0 0',
  }
};

export default DashboardHeader;
