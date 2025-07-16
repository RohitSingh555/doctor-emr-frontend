"use client";

import React from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface PatientTableProps {
  patients: PatientRegistration[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Insurance</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No patients found
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.full_name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.mobile_number}</TableCell>
                <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {patient.gender}
                  </Badge>
                </TableCell>
                <TableCell>{patient.health_insurance_provider}</TableCell>
                <TableCell>{`${patient.city}, ${patient.state_province}`}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil1Icon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 