import React from 'react';

export const Card = ({
  children,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const cardStyle = {
    ...styles.card,
    ...style,
  };

  return (
    <div
      className={`card ${className}`}
      style={cardStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--card-bg, #ffffff)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '16px',
    boxSizing: 'border-box',
  }
};

export default Card;
