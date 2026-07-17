import React, { useState } from 'react';

export const Select = ({
  options = [],
  value,
  onChange,
  name,
  className = '',
  style = {},
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const selectStyle = {
    ...styles.selectField,
    ...(focused ? styles.selectFocus : {}),
    ...style,
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`select-field ${className}`}
      style={selectStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

const styles = {
  selectField: {
    width: 'auto',
    boxSizing: 'border-box',
    padding: '8px 12px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'var(--bg)',
    color: 'var(--text-h)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  selectFocus: {
    outline: 'none',
    borderColor: 'var(--accent)',
  }
};

export default Select;
