import React from 'react';

export const Badge = ({
  children,
  style = {},
  className = '',
  ...props
}) => {
  const badgeStyle = {
    ...styles.badge,
    ...style,
  };

  return (
    <span
      className={`badge ${className}`}
      style={badgeStyle}
      {...props}
    >
      {children}
    </span>
  );
};

const styles = {
  badge: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  }
};

export default Badge;
