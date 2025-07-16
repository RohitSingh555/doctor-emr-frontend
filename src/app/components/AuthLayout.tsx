"use client";

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--teal-primary) 0%, var(--navy-blue) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--white)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-xl)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid var(--teal-light)',
  };

  const titleStyle: React.CSSProperties = {
    color: 'var(--gray-dark)',
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '0.5rem',
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'var(--gray-medium)',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginBottom: '2rem',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
} 