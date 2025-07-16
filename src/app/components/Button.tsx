"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  fullWidth = false
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '0.625rem 1.25rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          background: disabled ? 'var(--gray-medium)' : 'var(--teal-primary)',
          color: 'var(--white)',
        };
      case 'secondary':
        return {
          ...baseStyle,
          background: disabled ? 'var(--light-gray)' : 'var(--light-gray)',
          color: 'var(--gray-dark)',
          border: '1px solid var(--teal-light)',
        };
      case 'outline':
        return {
          ...baseStyle,
          background: 'transparent',
          color: disabled ? 'var(--gray-medium)' : 'var(--teal-primary)',
          border: `1px solid ${disabled ? 'var(--gray-medium)' : 'var(--teal-primary)'}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={getVariantStyle()}
    >
      {children}
    </button>
  );
} 