import React from 'react';
import Card from '../Card/Card';

export const StatsCards = ({ 
  totalTasks, 
  pendingTasks, 
  completedTasks, 
  statusFilter, 
  setStatusFilter 
}) => {
  const isAllActive = statusFilter === 'All';
  const isActiveActive = statusFilter === 'Active';
  const isCompletedActive = statusFilter === 'Completed';

  return (
    <div className="info-grid" style={styles.statsGridContainer}>
      <Card 
        onClick={() => setStatusFilter && setStatusFilter('All')}
        style={{
          ...styles.statsCardInteractive,
          ...styles.statsTotal,
          ...(isAllActive ? styles.statsTotalActive : {}),
        }}
      >
        <div className="info-label" style={isAllActive ? { color: 'var(--accent)', fontWeight: '700' } : {}}>Total Tasks</div>
        <div className="info-value" style={styles.statsValue}>{totalTasks}</div>
      </Card>
      
      <Card 
        onClick={() => setStatusFilter && setStatusFilter('Active')}
        style={{
          ...styles.statsCardInteractive,
          ...styles.statsPending,
          ...(isActiveActive ? styles.statsPendingActive : {}),
        }}
      >
        <div className="info-label" style={isActiveActive ? { color: '#f59e0b', fontWeight: '700' } : {}}>Pending / Active</div>
        <div className="info-value" style={styles.statsValue}>{pendingTasks}</div>
      </Card>

      <Card 
        onClick={() => setStatusFilter && setStatusFilter('Completed')}
        style={{
          ...styles.statsCardInteractive,
          ...styles.statsCompleted,
          ...(isCompletedActive ? styles.statsCompletedActive : {}),
        }}
      >
        <div className="info-label" style={isCompletedActive ? { color: '#10b981', fontWeight: '700' } : {}}>Completed Tasks</div>
        <div className="info-value" style={styles.statsValue}>{completedTasks}</div>
      </Card>
    </div>
  );
};

const styles = {
  statsGridContainer: {
    marginBottom: '32px',
  },
  statsCardInteractive: {
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--border)',
  },
  statsTotal: {
    borderLeft: '5px solid var(--accent)',
  },
  statsPending: {
    borderLeft: '5px solid #f59e0b',
  },
  statsCompleted: {
    borderLeft: '5px solid #10b981',
  },
  statsTotalActive: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px -5px rgba(255, 121, 26, 0.15), 0 8px 8px -5px rgba(255, 121, 26, 0.05)',
    borderColor: 'var(--accent)',
    background: 'var(--accent-bg)',
  },
  statsPendingActive: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px -5px rgba(245, 158, 11, 0.15), 0 8px 8px -5px rgba(245, 158, 11, 0.05)',
    borderColor: '#f59e0b',
    background: 'rgba(245, 158, 11, 0.08)',
  },
  statsCompletedActive: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px -5px rgba(16, 185, 129, 0.15), 0 8px 8px -5px rgba(16, 185, 129, 0.05)',
    borderColor: '#10b981',
    background: 'rgba(16, 185, 129, 0.08)',
  },
  statsValue: {
    fontSize: '28px',
    marginTop: '4px',
    fontWeight: '700',
  }
};

export default StatsCards;
