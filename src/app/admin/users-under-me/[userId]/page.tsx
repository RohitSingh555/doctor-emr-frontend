"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9500';

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  ADMIN: "bg-blue-500 text-white",
  DOCTOR: "bg-green-500 text-white",
  DOCTOR_ASSISTANT: "bg-teal-500 text-white",
  NURSE: "bg-yellow-500 text-white",
  LAB_TECHNICIAN: "bg-orange-500 text-white",
  PHARMACIST: "bg-cyan-500 text-white",
  BILLING_STAFF: "bg-pink-500 text-white",
  RECEPTIONIST: "bg-indigo-500 text-white",
  PATIENT: "bg-gray-300 text-gray-800",
};

export default function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE_URL}/auth/users/${userId}/profile`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setForm(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (section: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [section]: form[section] }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setProfile((prev: any) => ({ ...prev, [section]: form[section] }));
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16 text-2xl font-bold bg-muted-foreground/10">
            {profile.user.username[0]?.toUpperCase()}
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">{profile.user.username}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={roleColors[profile.user.role]}>{profile.user.role.replace("_", " ")}</Badge>
              <span className="text-muted-foreground text-sm">{profile.user.email}</span>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Tabs
        tabs={[
          {
            label: "Personal",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">First Name<Input value={form.personal?.first_name || ""} onChange={e => handleChange("personal", "first_name", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Last Name<Input value={form.personal?.last_name || ""} onChange={e => handleChange("personal", "last_name", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Middle Name<Input value={form.personal?.middle_name || ""} onChange={e => handleChange("personal", "middle_name", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Date of Birth<Input type="date" value={form.personal?.date_of_birth || ""} onChange={e => handleChange("personal", "date_of_birth", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Gender<Input value={form.personal?.gender || ""} onChange={e => handleChange("personal", "gender", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Marital Status<Input value={form.personal?.marital_status || ""} onChange={e => handleChange("personal", "marital_status", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Phone<Input value={form.personal?.phone || ""} onChange={e => handleChange("personal", "phone", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Alternate Phone<Input value={form.personal?.alternate_phone || ""} onChange={e => handleChange("personal", "alternate_phone", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Email<Input value={form.personal?.email || ""} onChange={e => handleChange("personal", "email", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Nationality<Input value={form.personal?.nationality || ""} onChange={e => handleChange("personal", "nationality", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Blood Group<Input value={form.personal?.blood_group || ""} onChange={e => handleChange("personal", "blood_group", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Photo URL<Input value={form.personal?.photo_url || ""} onChange={e => handleChange("personal", "photo_url", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("personal")} disabled={saving} className="mt-4">Save Personal</Button>
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Salary",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Salary Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">Current Salary<Input type="number" value={form.salary?.current_salary || ""} onChange={e => handleChange("salary", "current_salary", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Currency<Input value={form.salary?.currency || ""} onChange={e => handleChange("salary", "currency", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Effective Date<Input type="date" value={form.salary?.effective_date || ""} onChange={e => handleChange("salary", "effective_date", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Bonus<Input type="number" value={form.salary?.bonus || ""} onChange={e => handleChange("salary", "bonus", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("salary")} disabled={saving} className="mt-4">Save Salary</Button>
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Employment",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">Job Title<Input value={form.employment?.job_title || ""} onChange={e => handleChange("employment", "job_title", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Department<Input value={form.employment?.department || ""} onChange={e => handleChange("employment", "department", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Employment Type<Input value={form.employment?.employment_type || ""} onChange={e => handleChange("employment", "employment_type", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Start Date<Input type="date" value={form.employment?.start_date || ""} onChange={e => handleChange("employment", "start_date", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">End Date<Input type="date" value={form.employment?.end_date || ""} onChange={e => handleChange("employment", "end_date", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Status<Input value={form.employment?.status || ""} onChange={e => handleChange("employment", "status", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("employment")} disabled={saving} className="mt-4">Save Employment</Button>
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Addresses",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Addresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* For simplicity, only show the first address for editing. Expand as needed. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">Address Type<Input value={form.addresses?.[0]?.address_type || ""} onChange={e => handleChange("addresses", "address_type", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Address Line 1<Input value={form.addresses?.[0]?.address_line1 || ""} onChange={e => handleChange("addresses", "address_line1", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Address Line 2<Input value={form.addresses?.[0]?.address_line2 || ""} onChange={e => handleChange("addresses", "address_line2", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">City<Input value={form.addresses?.[0]?.city || ""} onChange={e => handleChange("addresses", "city", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">State<Input value={form.addresses?.[0]?.state || ""} onChange={e => handleChange("addresses", "state", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Country<Input value={form.addresses?.[0]?.country || ""} onChange={e => handleChange("addresses", "country", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Postal Code<Input value={form.addresses?.[0]?.postal_code || ""} onChange={e => handleChange("addresses", "postal_code", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("addresses")} disabled={saving} className="mt-4">Save Address</Button>
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Bank Details",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">Bank Name<Input value={form.bank_details?.bank_name || ""} onChange={e => handleChange("bank_details", "bank_name", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Account Number<Input value={form.bank_details?.account_number || ""} onChange={e => handleChange("bank_details", "account_number", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">IFSC Code<Input value={form.bank_details?.ifsc_code || ""} onChange={e => handleChange("bank_details", "ifsc_code", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Branch<Input value={form.bank_details?.branch || ""} onChange={e => handleChange("bank_details", "branch", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Account Type<Input value={form.bank_details?.account_type || ""} onChange={e => handleChange("bank_details", "account_type", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("bank_details")} disabled={saving} className="mt-4">Save Bank Details</Button>
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Emergency Contacts",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* For simplicity, only show the first contact for editing. Expand as needed. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">Name<Input value={form.emergency_contacts?.[0]?.name || ""} onChange={e => handleChange("emergency_contacts", "name", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Relationship<Input value={form.emergency_contacts?.[0]?.relationship || ""} onChange={e => handleChange("emergency_contacts", "relationship", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Phone<Input value={form.emergency_contacts?.[0]?.phone || ""} onChange={e => handleChange("emergency_contacts", "phone", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Address<Input value={form.emergency_contacts?.[0]?.address || ""} onChange={e => handleChange("emergency_contacts", "address", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("emergency_contacts")} disabled={saving} className="mt-4">Save Emergency Contact</Button>
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Documents",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* For simplicity, only show the first document for editing. Expand as needed. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium mb-1">Document Type<Input value={form.documents?.[0]?.document_type || ""} onChange={e => handleChange("documents", "document_type", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">File URL<Input value={form.documents?.[0]?.file_url || ""} onChange={e => handleChange("documents", "file_url", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Issue Date<Input type="date" value={form.documents?.[0]?.issue_date || ""} onChange={e => handleChange("documents", "issue_date", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Expiry Date<Input type="date" value={form.documents?.[0]?.expiry_date || ""} onChange={e => handleChange("documents", "expiry_date", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1">Notes<Input value={form.documents?.[0]?.notes || ""} onChange={e => handleChange("documents", "notes", e.target.value)} /></label>
                  </div>
                  <Button onClick={() => handleSave("documents")} disabled={saving} className="mt-4">Save Document</Button>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
} 