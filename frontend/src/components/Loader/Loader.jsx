import React from 'react';

export const Loader = ({ text = 'Loading...' }) => {
  return (
    <div style={styles.loaderContainer}>
      <div className="status-badge checking">
        <span className="status-dot"></span>
        <span>{text}</span>
      </div>
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 0',
    width: '100%',
  }
};

export default Loader;
