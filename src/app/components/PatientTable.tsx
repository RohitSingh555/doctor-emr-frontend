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

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: 'active' | 'inactive';
  lastVisit: string;
  insurance: string;
}

interface PatientTableProps {
  patients: Patient[];
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
            <TableHead>Status</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Insurance</TableHead>
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
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                <TableCell>{patient.insurance}</TableCell>
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