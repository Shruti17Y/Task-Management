import React from 'react';
import Button from '../Button/Button';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={styles.paginationContainer}>
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={styles.navButton}
      >
        Previous
      </Button>

      <div style={styles.pagesGroup}>
        {pageNumbers.map((number) => {
          const isCurrent = number === currentPage;
          return (
            <Button
              key={number}
              variant={isCurrent ? 'primary' : 'secondary'}
              onClick={() => onPageChange(number)}
              style={{
                ...styles.pageButton,
                ...(isCurrent ? styles.activePageButton : {}),
              }}
            >
              {number}
            </Button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={styles.navButton}
      >
        Next
      </Button>
    </div>
  );
};

const styles = {
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '24px',
    width: '100%',
  },
  pagesGroup: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  pageButton: {
    minWidth: '36px',
    height: '36px',
    padding: '0 8px',
    fontSize: '14px',
  },
  activePageButton: {
    cursor: 'default',
  },
  navButton: {
    padding: '8px 16px',
    fontSize: '14px',
  },
};

export default Pagination;
