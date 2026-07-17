import React from 'react';
import Card from '../Card/Card';

export const StatsCards = ({ totalTasks, pendingTasks, completedTasks }) => {
  return (
    <div className="info-grid" style={styles.statsGridContainer}>
      <Card style={styles.statsTotal}>
        <div className="info-label">Total Tasks</div>
        <div className="info-value" style={styles.statsValue}>{totalTasks}</div>
      </Card>
      
      <Card style={styles.statsPending}>
        <div className="info-label">Pending / Active</div>
        <div className="info-value" style={styles.statsValue}>{pendingTasks}</div>
      </Card>

      <Card style={styles.statsCompleted}>
        <div className="info-label">Completed Tasks</div>
        <div className="info-value" style={styles.statsValue}>{completedTasks}</div>
      </Card>
    </div>
  );
};

const styles = {
  statsGridContainer: {
    marginBottom: '32px',
  },
  statsTotal: {
    borderLeft: '4px solid var(--accent)',
  },
  statsPending: {
    borderLeft: '4px solid #f59e0b',
  },
  statsCompleted: {
    borderLeft: '4px solid #10b981',
  },
  statsValue: {
    fontSize: '28px',
    marginTop: '4px',
  }
};

export default StatsCards;
