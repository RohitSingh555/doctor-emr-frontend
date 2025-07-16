"use client";

import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('=== LOGIN DEBUG START ===');
      console.log('Attempting login for:', email);
      
      const response = await authAPI.login(email, password);
      console.log('Login API response:', response);
      
      if (response.token) {
        console.log('Token found in response:', response.token.substring(0, 20) + '...');
        
        // Store token in localStorage FIRST
        console.log('Storing token in localStorage...');
        localStorage.setItem('authToken', response.token);
        console.log('Token stored successfully');
        
        // Verify token is stored
        const storedToken = localStorage.getItem('authToken');
        console.log('Verified stored token:', storedToken ? storedToken.substring(0, 20) + '...' : 'No token found');
        
        // Get user data from the login response or fetch it
        console.log('Calling getCurrentUser...');
        const userData = await authAPI.getCurrentUser();
        console.log('User data received:', userData);
        
        login(response.token, userData);
        console.log('Login successful, redirecting...');
        router.push('/');
      } else {
        console.error('No token in login response!');
        setError('Login failed: No token received');
      }
      console.log('=== LOGIN DEBUG END ===');
    } catch (err: any) {
      console.error('Login error:', err);
      const detail = err.response?.data?.detail;
      setError(detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 8px 0'
          }}>
            Welcome back
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: '0'
          }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {Array.isArray(error)
              ? error.map((err, idx) => <div key={idx}>{err.msg || JSON.stringify(err)}</div>)
              : error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: loading ? '#f9fafb' : '#ffffff',
                color: '#1f2937',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: loading ? '#f9fafb' : '#ffffff',
                color: '#1f2937',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/signup" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'color 0.2s ease'
          }}>
            Don't have an account? Sign up
          </a>
          
          {/* Debug button */}
          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                const token = localStorage.getItem('authToken');
                console.log('Current token in localStorage:', token ? token.substring(0, 20) + '...' : 'No token');
                alert(token ? `Token found: ${token.substring(0, 20)}...` : 'No token found');
              }}
              style={{
                background: 'transparent',
                border: '1px solid #667eea',
                color: '#667eea',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Debug: Check Token
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 