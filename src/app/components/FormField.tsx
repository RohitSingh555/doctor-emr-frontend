"use client";

import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function FormField({ 
  label, 
  type, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  placeholder
}: FormFieldProps) {
  const containerStyle: React.CSSProperties = {
    marginBottom: '1rem',
  };

  const labelStyle: React.CSSProperties = {
    color: 'var(--gray-dark)',
    display: 'block',
    marginBottom: '0.375rem',
    fontWeight: '500',
    fontSize: '0.875rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.75rem',
    border: '1px solid var(--teal-light)',
    borderRadius: '6px',
    fontSize: '0.875rem',
    background: disabled ? 'var(--light-gray)' : 'var(--white)',
    color: 'var(--gray-dark)',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
} 