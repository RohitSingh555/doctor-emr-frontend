"use client";

import React, { useState, useEffect } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  department: string;
}

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patient?: Patient | null;
}

export default function PatientModal({ isOpen, onClose, onSave, patient }: PatientModalProps) {
  const [formData, setFormData] = useState<Patient>({
    name: '',
    email: '',
    phone: '',
    department: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({ name: '', email: '', phone: '', department: '' });
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    background: 'var(--teal-contrast)',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--teal-medium)',
    borderRadius: '6px',
    fontSize: '1rem',
    marginBottom: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'var(--teal)',
    color: 'var(--teal-contrast)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '1rem',
  };

  const cancelButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--teal-dark-text)',
    border: '1px solid var(--teal-medium)',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '500',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--teal-deep)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--teal-dark-text)' }}
          >
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="phone" style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="department" style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Department
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General">General</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={buttonStyle}>
              {patient ? 'Update' : 'Add'} Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 