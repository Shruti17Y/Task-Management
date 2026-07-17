import React, { useState } from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'secondary', // 'primary' | 'secondary' | 'danger'
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          ...styles.primary,
          ...(hovered ? styles.primaryHover : {}),
        };
      case 'secondary':
        return {
          ...styles.secondary,
          ...(hovered ? styles.secondaryHover : {}),
        };
      case 'danger':
        return {
          ...styles.danger,
          ...(hovered ? styles.dangerHover : {}),
        };
      default:
        return {};
    }
  };

  const buttonStyles = {
    ...styles.btn,
    ...getVariantStyles(),
    ...(disabled ? styles.disabled : {}),
    ...(active && !disabled ? styles.active : {}),
    ...style,
  };

  return (
    <button
      type={type}
      className={`btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...props}
    >
      {children}
    </button>
  );
};

const styles = {
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    boxSizing: 'border-box',
  },
  primary: {
    background: 'var(--accent-gradient, var(--accent))',
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 4px 10px var(--accent-shadow, rgba(255, 121, 26, 0.2))',
  },
  primaryHover: {
    background: 'var(--accent-gradient-hover, var(--accent-hover))',
    boxShadow: '0 6px 14px var(--accent-shadow, rgba(255, 121, 26, 0.25))',
    transform: 'translateY(-1px)',
  },
  secondary: {
    background: 'var(--code-bg)',
    color: 'var(--text-h)',
    borderColor: 'var(--border)',
  },
  secondaryHover: {
    background: 'var(--border)',
  },
  danger: {
    background: 'transparent',
    color: '#ef4444',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerHover: {
    background: 'rgba(239, 68, 68, 0.05)',
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
  active: {
    transform: 'scale(0.98)',
  }
};

export default Button;
