"use client";

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentChange: string;
  trend: 'up' | 'down';
  color?: string;
}

export default function StatCard({ title, value, icon, percentChange, trend, color = "bg-blue-500" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentChange}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
} 