"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PatientTable from '../components/PatientTable';
import PatientModal from '../components/PatientModal';
import { PersonIcon, PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import RequireAuth from '../components/RequireAuth';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patientRegistrationAPI } from '../services/api';
import { useRouter } from 'next/navigation';

interface PatientRegistration {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  relationship_to_emergency_contact: string;
  primary_physician_name: string | null;
  primary_physician_contact: string | null;
  health_insurance_provider: string;
  insurance_policy_number: string;
  preferred_language: string | null;
  ethnicity: string | null;
  communication_preference: string | null;
  consent_for_data_usage: boolean;
  consent_for_processing: boolean;
  consent_for_third_party_sharing: boolean;
  created_at: string;
  updated_at: string;
}

export default function PatientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState<PatientRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await patientRegistrationAPI.getAll();
        console.log('Fetched patients:', data);
        setPatients(data);
      } catch (err: any) {
        console.error('Error fetching patients:', err);
        setError(err.response?.data?.detail || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.mobile_number.includes(searchTerm);
    // For now, we'll consider all patients as active since we don't have a status field
    const matchesFilter = filterStatus === 'all' || filterStatus === 'active';
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: patients.length,
    active: patients.length, // All patients are considered active for now
    inactive: 0,
    newThisMonth: patients.filter(p => {
      const createdAt = new Date(p.created_at);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length
  };

  const handleAddPatient = () => {
    router.push('/patients/add');
  };

  if (loading) {
    return (
      <RequireAuth>
        <DashboardLayout>
          <div className="w-full px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading patients...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="w-full px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Patients</h1>
                <p className="text-muted-foreground">Manage your patient records and information</p>
              </div>
              <Button
                onClick={handleAddPatient}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Patient</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PersonIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                    <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <PersonIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inactive Patients</p>
                    <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <PersonIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-bold text-foreground">{stats.newThisMonth}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <PersonIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search patients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Table */}
          <Card>
            <PatientTable patients={filteredPatients} />
          </Card>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
} 