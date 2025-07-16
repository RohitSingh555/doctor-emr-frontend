"use client";

import React from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import { CalendarIcon, PersonIcon, ActivityLogIcon, BarChartIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const recentActivities = [
    { id: 1, type: 'patient', action: 'New patient registration', details: 'John Smith', time: '2 minutes ago', status: 'completed' },
    { id: 2, type: 'appointment', action: 'Appointment scheduled', details: 'Cardiology consultation', time: '15 minutes ago', status: 'scheduled' },
    { id: 3, type: 'record', action: 'Medical record updated', details: 'Patient #2847', time: '1 hour ago', status: 'updated' },
    { id: 4, type: 'lab', action: 'Lab results received', details: 'Blood work analysis', time: '2 hours ago', status: 'completed' },
    { id: 5, type: 'prescription', action: 'Prescription issued', details: 'Antibiotics for Patient #1234', time: '3 hours ago', status: 'issued' },
  ];

  const quickActions = [
    { id: 1, title: 'Add New Patient', icon: '👤', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 2, title: 'Schedule Appointment', icon: '📅', color: 'bg-green-500 hover:bg-green-600' },
    { id: 3, title: 'Generate Report', icon: '📊', color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 4, title: 'View Analytics', icon: '📈', color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="w-full px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back{user ? `, ${user.username}` : ''} 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your EMR system today
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Appointments"
              value={156}
              icon={<CalendarIcon className="w-6 h-6" />}
              percentChange="+12.5% from last month"
              trend="up"
              color="bg-blue-500"
            />
            <StatCard
              title="Active Patients"
              value={2847}
              icon={<PersonIcon className="w-6 h-6" />}
              percentChange="+8.2% from last month"
              trend="up"
              color="bg-green-500"
            />
            <StatCard
              title="Completed Procedures"
              value={89}
              icon={<ActivityLogIcon className="w-6 h-6" />}
              percentChange="-3.1% from last month"
              trend="down"
              color="bg-purple-500"
            />
            <StatCard
              title="Monthly Revenue"
              value="$284,500"
              icon={<BarChartIcon className="w-6 h-6" />}
              percentChange="+15.3% from last month"
              trend="up"
              color="bg-orange-500"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'patient' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'appointment' ? 'bg-green-100 text-green-600' :
                        activity.type === 'record' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'lab' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'patient' && <PersonIcon className="w-5 h-5" />}
                        {activity.type === 'appointment' && <CalendarIcon className="w-5 h-5" />}
                        {activity.type === 'record' && <ActivityLogIcon className="w-5 h-5" />}
                        {activity.type === 'lab' && <BarChartIcon className="w-5 h-5" />}
                        {activity.type === 'prescription' && <ActivityLogIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.details}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'updated' ? 'bg-purple-100 text-purple-800' :
                        activity.status === 'issued' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & System Status */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className={`w-full ${action.color} text-white rounded-lg px-4 py-3 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{action.icon}</span>
                        <span className="font-medium">{action.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Services</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backup System</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Running
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Security</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Today's Summary */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Appointments</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">New Patients</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Completed</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Pending</span>
                    <span className="font-semibold">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
