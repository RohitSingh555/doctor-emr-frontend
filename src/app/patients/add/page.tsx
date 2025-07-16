"use client";

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import RequireAuth from '../../components/RequireAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftIcon, PersonIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { patientRegistrationAPI } from '../../services/api';

export default function AddPatientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: 'United States',
    emergency_contact_name: '',
    emergency_contact_number: '',
    relationship_to_emergency_contact: '',
    primary_physician_name: '',
    primary_physician_contact: '',
    health_insurance_provider: '',
    insurance_policy_number: '',
    preferred_language: 'English',
    ethnicity: '',
    communication_preference: 'EMAIL',
    consent_for_data_usage: true,
    consent_for_processing: true,
    consent_for_third_party_sharing: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Format the data for the API
      const patientData = {
        ...formData,
        date_of_birth: new Date(formData.date_of_birth).toISOString(),
        // Ensure optional fields are properly handled
        primary_physician_name: formData.primary_physician_name || null,
        primary_physician_contact: formData.primary_physician_contact || null,
        insurance_card_upload: null,
        id_proof_upload: null,
        preferred_language: formData.preferred_language || null,
        ethnicity: formData.ethnicity || null,
        communication_preference: formData.communication_preference || null
      };

      // Make API call to create patient registration
      const response = await patientRegistrationAPI.create(patientData);
      
      console.log('Patient created successfully:', response);
      
      // Redirect to patients list
      router.push('/patients');
    } catch (err: any) {
      console.error('Error creating patient:', err);
      setError(err.response?.data?.detail || 'Failed to create patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PersonIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
                <p className="text-muted-foreground">Register a new patient in the system</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mobile_number">Phone Number *</Label>
                    <Input
                      id="mobile_number"
                      type="tel"
                      value={formData.mobile_number}
                      onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state_province">State *</Label>
                      <Input
                        id="state_province"
                        value={formData.state_province}
                        onChange={(e) => handleInputChange('state_province', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">ZIP Code *</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergency_contact_number">Emergency Contact Phone *</Label>
                    <Input
                      id="emergency_contact_number"
                      type="tel"
                      value={formData.emergency_contact_number}
                      onChange={(e) => handleInputChange('emergency_contact_number', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="relationship_to_emergency_contact">Relationship to Emergency Contact *</Label>
                    <Input
                      id="relationship_to_emergency_contact"
                      value={formData.relationship_to_emergency_contact}
                      onChange={(e) => handleInputChange('relationship_to_emergency_contact', e.target.value)}
                      placeholder="e.g., Spouse, Parent, Child"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Primary Physician */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Physician (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primary_physician_name">Primary Physician Name</Label>
                    <Input
                      id="primary_physician_name"
                      value={formData.primary_physician_name}
                      onChange={(e) => handleInputChange('primary_physician_name', e.target.value)}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="primary_physician_contact">Primary Physician Contact</Label>
                    <Input
                      id="primary_physician_contact"
                      type="tel"
                      value={formData.primary_physician_contact}
                      onChange={(e) => handleInputChange('primary_physician_contact', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="health_insurance_provider">Insurance Provider *</Label>
                    <Select value={formData.health_insurance_provider} onValueChange={(value) => handleInputChange('health_insurance_provider', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue_cross">Blue Cross Blue Shield</SelectItem>
                        <SelectItem value="aetna">Aetna</SelectItem>
                        <SelectItem value="cigna">Cigna</SelectItem>
                        <SelectItem value="unitedhealth">UnitedHealth</SelectItem>
                        <SelectItem value="humana">Humana</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="insurance_policy_number">Insurance Policy Number *</Label>
                    <Input
                      id="insurance_policy_number"
                      value={formData.insurance_policy_number}
                      onChange={(e) => handleInputChange('insurance_policy_number', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="preferred_language">Preferred Language</Label>
                      <Select value={formData.preferred_language} onValueChange={(value) => handleInputChange('preferred_language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="communication_preference">Communication Preference</Label>
                      <Select value={formData.communication_preference} onValueChange={(value) => handleInputChange('communication_preference', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="PHONE">Phone</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Input
                        id="ethnicity"
                        value={formData.ethnicity}
                        onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                        placeholder="e.g., Caucasian, Hispanic, African American"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Saving...' : 'Save Patient'}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
} 