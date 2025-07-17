"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../components/RequireAuth";
import { tasksAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon, TrashIcon, Pencil1Icon, PersonIcon, CalendarIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { usersAPI } from "../services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Task {
  id: number;
  title: string;
  description?: string;
  is_urgent: boolean;
  status: string;
  priority: string;
  due_date?: string;
  notify_on_due: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  created_by_id?: number;
  created_by_username?: string;
  assignees?: { user_id: number; username?: string }[];
  patient_id?: number;
  patient_name?: string;
  related_entity_type?: string;
  related_entity_id?: number;
  visibility: string;
  tags?: string[];
  checklist?: { text: string; completed: boolean }[];
  attachments?: { url: string; name: string }[];
  comments?: any[];
  activity_log?: any;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    is_urgent: false,
    due_date: "",
    priority: "medium",
    notify_on_due: true,
  });
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [assignees, setAssignees] = useState<number[]>([]);
  const [status, setStatus] = useState("todo");
  const [visibility, setVisibility] = useState("internal");
  const [tags, setTags] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
  const [checklistInput, setChecklistInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    usersAPI.getAll().then(setUsers);
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...newTask,
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : undefined,
        status,
        visibility,
        assignees: assignees.map(user_id => ({ user_id })),
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        checklist: checklist.map(text => ({ text, completed: false })),
        attachments: attachments.length > 0 ? attachments.map(file => ({ url: file.name, name: file.name })) : undefined,
      };
      await tasksAPI.create(formData);
      setShowAdd(false);
      setNewTask({ title: "", description: "", is_urgent: false, due_date: "", priority: "medium", notify_on_due: true });
      setAssignees([]);
      setStatus("todo");
      setVisibility("internal");
      setTags("");
      setChecklist([]);
      setAttachments([]);
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await tasksAPI.delete(id);
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete task");
    }
  };

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="w-full px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
              <p className="text-muted-foreground">Manage your to-do list and team tasks</p>
            </div>
            <Button onClick={() => setShowAdd(true)} className="flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Add Task</span>
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Add Task Modal */}
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-muted/40">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Add New Task</h2>
                <form onSubmit={handleAddTask} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                      <Input id="title" placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition" />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={val => setNewTask({ ...newTask, priority: val })}>
                        <SelectTrigger id="priority" className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition"><SelectValue placeholder="Priority" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition" />
                    </div>
                    <div>
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input id="due_date" type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition" />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select value={visibility} onValueChange={setVisibility}>
                        <SelectTrigger id="visibility" className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition"><SelectValue placeholder="Visibility" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="assignees">Assignees</Label>
                      <div className="border rounded p-2 max-h-32 overflow-y-auto bg-muted/20">
                        {users.map(user => (
                          <label key={user.id} className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted/40 transition">
                            <input
                              type="checkbox"
                              checked={assignees.includes(user.id)}
                              onChange={e => {
                                if (e.target.checked) setAssignees([...assignees, user.id]);
                                else setAssignees(assignees.filter(id => id !== user.id));
                              }}
                              className="accent-primary"
                            />
                            <span>{user.username}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="Comma separated" value={tags} onChange={e => setTags(e.target.value)} className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition" />
                    </div>
                    <div className="flex items-center space-x-4 md:col-span-2">
                      <input type="checkbox" checked={newTask.is_urgent} onChange={e => setNewTask({ ...newTask, is_urgent: e.target.checked })} className="accent-red-500" id="urgent" />
                      <Label htmlFor="urgent">Urgent</Label>
                      <input type="checkbox" checked={newTask.notify_on_due} onChange={e => setNewTask({ ...newTask, notify_on_due: e.target.checked })} className="accent-blue-500 ml-4" id="notify_on_due" />
                      <Label htmlFor="notify_on_due">Notify on Due</Label>
                    </div>
                  </div>
                  {/* Checklist */}
                  <div>
                    <Label>Checklist</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input placeholder="Add checklist item" value={checklistInput} onChange={e => setChecklistInput(e.target.value)} className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition" />
                      <Button type="button" onClick={() => { if (checklistInput) { setChecklist([...checklist, checklistInput]); setChecklistInput(""); } }} className="bg-primary/90 hover:bg-primary text-white">Add</Button>
                    </div>
                    <ul className="list-disc pl-5">
                      {checklist.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between py-1">
                          <span>{item}</span>
                          <Button type="button" size="icon" variant="ghost" onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))} className="text-red-500">&times;</Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Attachments */}
                  <div>
                    <Label htmlFor="attachments">Attachments</Label>
                    <Input id="attachments" type="file" multiple onChange={e => setAttachments(e.target.files ? Array.from(e.target.files) : [])} className="bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/30 transition" />
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button type="button" variant="ghost" onClick={() => setShowAdd(false)} className="border border-muted/40">Cancel</Button>
                    <Button type="submit" className="bg-primary/90 hover:bg-primary text-white">Add Task</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <p>No tasks found. Start by adding a new task.</p>
              </div>
            ) : (
              tasks.map(task => (
                <Card
                  key={task.id}
                  className="relative group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-primary/40 hover:scale-[1.025] transition-all duration-200 cursor-pointer overflow-hidden p-0"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="p-5 pb-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {task.is_urgent && <ExclamationTriangleIcon className="text-red-500 w-5 h-5" />}
                        <span className="text-lg font-semibold text-primary truncate max-w-[160px]">{task.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold shadow-sm ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "critical" ? "bg-red-200 text-red-900" : task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{task.priority}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[32px]">{task.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {task.due_date && <><CalendarIcon className="w-3 h-3" /> <span>Due {new Date(task.due_date).toLocaleDateString()}</span></>}
                      {task.patient_name && <><PersonIcon className="w-3 h-3 ml-2" /> <span>{task.patient_name}</span></>}
                    </div>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.tags.map((tag, i) => (
                          <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">{tag}</span>
                        ))}
                      </div>
                    )}
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79V17a5 5 0 01-5 5h-4a5 5 0 01-5-5V7a5 5 0 015-5h4a5 5 0 015 5v7a3 3 0 01-3 3h-4a3 3 0 01-3-3V7" /></svg>
                        <span className="text-xs text-muted-foreground">{task.attachments.length} attachment(s)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${task.status === "done" ? "bg-green-100 text-green-700" : task.status === "in_progress" ? "bg-blue-100 text-blue-700" : task.status === "todo" ? "bg-gray-100 text-gray-700" : "bg-yellow-100 text-yellow-700"}`}>{task.status.replace('_', ' ')}</span>
                      {task.is_urgent && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold ml-2">Urgent</span>}
                    </div>
                  </div>
                  {task.status === "done" && (
                    <div className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full shadow">Completed</div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-muted/40 relative animate-fade-in flex flex-col gap-4">
            <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-primary text-2xl font-bold transition-colors">&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-primary flex items-center gap-2">
              {selectedTask.is_urgent && <ExclamationTriangleIcon className="text-red-500 w-5 h-5" />} {selectedTask.title}
            </h2>
            <div className="mb-2 text-base text-muted-foreground">{selectedTask.description}</div>
            <div className="grid grid-cols-1 gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">Status:</span> <span className="capitalize px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{selectedTask.status.replace('_', ' ')}</span>
                <span className="ml-4 font-semibold">Priority:</span> <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">{selectedTask.priority}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {selectedTask.due_date && <><CalendarIcon className="w-3 h-3" /> <span>Due {new Date(selectedTask.due_date).toLocaleDateString()}</span></>}
                {selectedTask.patient_name && <><PersonIcon className="w-3 h-3 ml-2" /> <span>{selectedTask.patient_name}</span></>}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">Visibility:</span> <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 font-medium">{selectedTask.visibility}</span>
              </div>
              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTask.tags.map((tag, i) => (
                    <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">{tag}</span>
                  ))}
                </div>
              )}
              {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="font-semibold text-xs">Assignees:</span>
                  {selectedTask.assignees.map((a, i) => (
                    <span key={i} className="bg-muted/60 text-foreground px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">{users.find(u => u.id === a.user_id)?.username || a.user_id}</span>
                  ))}
                </div>
              )}
              {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                <div>
                  <span className="font-semibold text-xs">Checklist:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {selectedTask.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        {item.completed ? <CheckIcon className="text-green-500 w-3 h-3" /> : <span className="inline-block w-3 h-3 border rounded-full border-muted-foreground" />}
                        <span className={item.completed ? "line-through" : ""}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  <span className="font-semibold text-xs">Attachments:</span>
                  {selectedTask.attachments.map((att, i) => (
                    <span key={i} className="flex items-center gap-2 text-xs">
                      <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79V17a5 5 0 01-5 5h-4a5 5 0 01-5-5V7a5 5 0 015-5h4a5 5 0 015 5v7a3 3 0 01-3 3h-4a3 3 0 01-3-3V7" /></svg>
                      <span>{att.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              <span>Created: {selectedTask.created_at ? new Date(selectedTask.created_at).toLocaleString() : "-"}</span>
              {selectedTask.created_by_username && <span className="ml-4">By: {selectedTask.created_by_username}</span>}
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  );
} 