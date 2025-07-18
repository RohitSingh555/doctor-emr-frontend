"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/app/components/DashboardLayout";
import { useAuth } from "@/app/context/AuthContext";

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

export default function UsersUnderMePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user: currentUser } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8500';

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE_URL}/auth/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_role: newRole })
      });
      if (!res.ok) throw new Error("Failed to update role");
      setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (e: any) {
      alert(e.message || "Failed to update role");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-muted-foreground">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && users.length === 0 && (
              <div className="text-muted-foreground">No users found.</div>
            )}
            {!loading && !error && users.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded shadow-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-2 flex items-center gap-2">
                          <Avatar className="w-7 h-7 text-base font-bold bg-muted-foreground/10">
                            {u.username[0]?.toUpperCase()}
                          </Avatar>
                          <span>{u.username}</span>
                        </td>
                        <td className="px-4 py-2">
                          <Badge className={roleColors[u.role]}>{u.role.replace("_", " ")}</Badge>
                        </td>
                        <td className="px-4 py-2 text-center space-x-2">
                          <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Analytics</button>
                          {currentUser && ["ADMIN", "SUPER_ADMIN"].includes(currentUser.role) && (
                            <>
                              <button
                                className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
                                onClick={() => handleRoleChange(u.id, "ADMIN")}
                                disabled={u.role === "ADMIN" || u.role === "SUPER_ADMIN"}
                              >Promote</button>
                              <button
                                className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                                onClick={() => handleRoleChange(u.id, "PATIENT")}
                                disabled={u.role === "PATIENT"}
                              >Demote</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 