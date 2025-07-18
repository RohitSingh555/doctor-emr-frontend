import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";

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

function UserNode({ user, level = 0 }: { user: any; level?: number }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginLeft: level * 24 }} className="mb-2">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setOpen((v) => !v)}>
        {user.subordinates.length > 0 && (
          <span className="text-lg select-none mr-1">
            {open ? "▼" : "▶"}
          </span>
        )}
        <Avatar className="w-7 h-7 text-base font-bold bg-muted-foreground/10">
          {user.username[0]?.toUpperCase()}
        </Avatar>
        <span className="font-medium text-foreground group-hover:underline">
          {user.username}
        </span>
        <Badge className={roleColors[user.role] + " ml-2"}>{user.role.replace("_", " ")}</Badge>
      </div>
      {open && user.subordinates.length > 0 && (
        <div className="mt-1">
          {user.subordinates.map((sub: any) => (
            <UserNode key={sub.id} user={sub} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

const UserHierarchyTree = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/auth/users/hierarchy")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hierarchy");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-muted-foreground">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && data.length === 0 && (
          <div className="text-muted-foreground">No users found.</div>
        )}
        {!loading && !error && data.length > 0 && (
          <div>
            {data.map((user) => (
              <UserNode key={user.id} user={user} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UserAnalytics = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users for dropdown
  useEffect(() => {
    fetch("/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        // Default to first SUPER_ADMIN or ADMIN
        const defaultUser = data.find((u: any) => u.role === "SUPER_ADMIN") || data.find((u: any) => u.role === "ADMIN") || data[0];
        if (defaultUser) setSelectedUser(defaultUser.id.toString());
      });
  }, []);

  // Fetch analytics for selected user
  useEffect(() => {
    if (!selectedUser) return;
    setLoading(true);
    setError("");
    fetch(`/api/auth/users/${selectedUser}/analytics`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then(setAnalytics)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  const selectedUserObj = useMemo(() => users.find((u) => u.id.toString() === selectedUser), [users, selectedUser]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select User</label>
            <select
              className="border rounded px-3 py-2 min-w-[200px]"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
          </div>
          {selectedUserObj && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 text-base font-bold bg-muted-foreground/10">
                {selectedUserObj.username[0]?.toUpperCase()}
              </Avatar>
              <span className="font-medium text-foreground">{selectedUserObj.username}</span>
              <Badge className={roleColors[selectedUserObj.role] + " ml-2"}>{selectedUserObj.role.replace("_", " ")}</Badge>
            </div>
          )}
        </div>
        {loading && <div className="text-muted-foreground">Loading analytics...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && analytics.length === 0 && (
          <div className="text-muted-foreground">No subordinates or analytics found.</div>
        )}
        {!loading && !error && analytics.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">Assigned</th>
                  <th className="px-4 py-2 text-center">Completed</th>
                  <th className="px-4 py-2 text-center">Overdue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar className="w-7 h-7 text-base font-bold bg-muted-foreground/10">
                        {a.username[0]?.toUpperCase()}
                      </Avatar>
                      <span>{a.username}</span>
                    </td>
                    <td className="px-4 py-2">
                      <Badge className={roleColors[a.role]}>{a.role.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold text-blue-700">{a.assigned_tasks}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-700">{a.completed_tasks}</td>
                    <td className="px-4 py-2 text-center font-semibold text-red-600">{a.overdue_tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
      <Tabs
        tabs={[
          { label: "Hierarchy", content: <UserHierarchyTree /> },
          { label: "Analytics", content: <UserAnalytics /> },
        ]}
      />
    </div>
  );
} 