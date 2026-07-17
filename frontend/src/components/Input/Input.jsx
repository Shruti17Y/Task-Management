import React, { useState } from 'react';

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className = '',
  style = {},
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    ...styles.inputField,
    ...(focused ? styles.inputFocus : {}),
    ...style,
  };

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`input-field ${className}`}
      style={inputStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
};

const styles = {
  inputField: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'var(--bg)',
    color: 'var(--text-h)',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  inputFocus: {
    outline: 'none',
    borderColor: 'var(--accent)',
  }
};

export default Input;
