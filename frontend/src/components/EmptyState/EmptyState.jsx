import React from 'react';
import Card from '../Card/Card';

export const EmptyState = ({
  title = 'No Data Found',
  description,
}) => {
  return (
    <Card style={styles.emptyState}>
      <div className="info-label" style={styles.emptyStateTitle}>
        {title}
      </div>
      {description && <p style={styles.emptyStateDescription}>{description}</p>}
    </Card>
  );
};

const styles = {
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text)',
  },
  emptyStateTitle: {
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'none',
    color: 'var(--text-h)',
  },
  emptyStateDescription: {
    margin: '8px 0 0',
    fontSize: '14px',
  }
};

export default EmptyState;
