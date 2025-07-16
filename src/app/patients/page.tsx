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

export default function PatientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();

  // Mock data - replace with actual API call
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-03-15',
      status: 'active',
      lastVisit: '2024-01-15',
      insurance: 'Blue Cross Blue Shield'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1990-07-22',
      status: 'active',
      lastVisit: '2024-01-10',
      insurance: 'Aetna'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      dateOfBirth: '1978-11-08',
      status: 'inactive',
      lastVisit: '2023-12-20',
      insurance: 'Cigna'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      dateOfBirth: '1992-05-14',
      status: 'active',
      lastVisit: '2024-01-12',
      insurance: 'UnitedHealth'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 567-8901',
      dateOfBirth: '1983-09-30',
      status: 'active',
      lastVisit: '2024-01-08',
      insurance: 'Humana'
    }
  ]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    inactive: patients.filter(p => p.status === 'inactive').length,
    newThisMonth: 3
  };

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
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Patient</span>
              </Button>
            </div>
          </div>

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
                      <SelectItem value="inactive">Inactive</SelectItem>
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

        {/* Add Patient Modal */}
        <PatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(newPatient) => {
            setPatients([...patients, { ...newPatient, id: patients.length + 1 }]);
            setIsModalOpen(false);
          }}
        />
      </DashboardLayout>
    </RequireAuth>
  );
} 