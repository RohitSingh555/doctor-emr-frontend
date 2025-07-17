"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../components/RequireAuth";
import { tasksAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PlusIcon, 
  CheckIcon, 
  TrashIcon, 
  Pencil1Icon, 
  PersonIcon, 
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from "@radix-ui/react-icons";
import { usersAPI } from "../services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addNotification } from '../utils/notifications';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, AlarmClock, Paperclip, User2, Tag, Loader2, CheckCircle2, Trash2, PlayCircle, PauseCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { format } from "date-fns";

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

type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

const TASK_STATUSES: { value: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'todo', label: 'To Do', icon: <PlayIcon className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { value: 'in_progress', label: 'In Progress', icon: <PauseIcon className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'done', label: 'Completed', icon: <CheckIcon className="w-4 h-4" />, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'cancelled', label: 'Cancelled', icon: <StopIcon className="w-4 h-4" />, color: 'bg-red-100 text-red-700 hover:bg-red-200' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskStatus>('todo');
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    is_urgent: false,
    due_date: "",
    due_time: "",
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
    startNotificationCheck();
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

  const startNotificationCheck = () => {
    const checkDueTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.due_date && task.notify_on_due && task.status !== 'done') {
          const dueDate = new Date(task.due_date);
          const timeDiff = dueDate.getTime() - now.getTime();
          
          // Notify if due within 5 minutes and not already notified
          if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
            const notificationKey = `task_${task.id}_notified`;
            if (!localStorage.getItem(notificationKey)) {
              addNotification({
                id: `task_${task.id}_${Date.now()}`,
                title: "Task Due Soon",
                message: `Task "${task.title}" is due in ${Math.ceil(timeDiff / 60000)} minutes`,
                type: 'task',
                read: false
              });
              localStorage.setItem(notificationKey, 'true');
            }
          }
          
          // Notify if overdue
          if (timeDiff < 0) {
            const overdueKey = `task_${task.id}_overdue`;
            if (!localStorage.getItem(overdueKey)) {
              addNotification({
                id: `task_${task.id}_overdue_${Date.now()}`,
                title: "Task Overdue",
                message: `Task "${task.title}" is overdue`,
                type: 'warning',
                read: false
              });
              localStorage.setItem(overdueKey, 'true');
            }
          }
        }
      });
    };

    checkDueTasks();
    const interval = setInterval(checkDueTasks, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let dueDate = undefined;
      if (newTask.due_date) {
        if (newTask.due_time) {
          // Combine date and time
          const dateTime = new Date(`${newTask.due_date}T${newTask.due_time}`);
          dueDate = dateTime.toISOString();
        } else {
          dueDate = new Date(newTask.due_date).toISOString();
        }
      }

      const formData = {
        ...newTask,
        due_date: dueDate,
        status,
        visibility,
        assignees: assignees.map(user_id => ({ user_id })),
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        checklist: checklist.map(text => ({ text, completed: false })),
        attachments: attachments.length > 0 ? attachments.map(file => ({ url: file.name, name: file.name })) : undefined,
      };
      await tasksAPI.create(formData);
      setShowAdd(false);
      setNewTask({ title: "", description: "", is_urgent: false, due_date: "", due_time: "", priority: "medium", notify_on_due: true });
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

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updateData = {
        ...task,
        status: newStatus,
        completed_at: newStatus === 'done' ? new Date().toISOString() : undefined
      };

      await tasksAPI.update(taskId, updateData);
      fetchTasks();

      if (newStatus === 'done') {
        addNotification({
          id: `task_completed_${taskId}_${Date.now()}`,
          title: "Task Completed",
          message: `Task "${task.title}" has been marked as completed`,
          type: 'task',
          read: false
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update task status");
    }
  };

  const handleDelayTask = async (taskId: number, delayMinutes: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.due_date) return;

      const currentDueDate = new Date(task.due_date);
      const newDueDate = new Date(currentDueDate.getTime() + delayMinutes * 60 * 1000);

      const updateData = {
        ...task,
        due_date: newDueDate.toISOString()
      };

      await tasksAPI.update(taskId, updateData);
      fetchTasks();

      addNotification({
        id: `task_delayed_${taskId}_${Date.now()}`,
        title: "Task Delayed",
        message: `Task "${task.title}" has been delayed by ${delayMinutes} minutes`,
        type: 'info',
        read: false
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delay task");
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

  const getStatusIcon = (status: string) => {
    const statusConfig = TASK_STATUSES.find(s => s.value === status);
    return statusConfig?.icon || <PlayIcon className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const statusConfig = TASK_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  // Forward-only progression: tasks can only move forward, not backward
  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case 'todo':
        return 'in_progress';
      case 'in_progress':
        return 'done';
      case 'done':
        return null; // No next status - task is complete
      case 'cancelled':
        return null; // No next status - task is cancelled
      default:
        return 'in_progress';
    }
  };

  // Get available status options for a task (forward progression only)
  const getAvailableStatuses = (currentStatus: TaskStatus): TaskStatus[] => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      return [nextStatus];
    }
    return [];
  };

  // Filter tasks by active tab
  const filteredTasks = tasks.filter(task => task.status === activeTab);

  // Get task counts for each status
  const getTaskCount = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status).length;
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

          {/* Status Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {TASK_STATUSES.map((statusConfig) => (
                <button
                  key={statusConfig.value}
                  onClick={() => setActiveTab(statusConfig.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === statusConfig.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getTaskCount(statusConfig.value)}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Add Task Modal */}
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-muted/40 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2"><PlusIcon className="w-6 h-6 text-primary" /> Add New Task</h2>
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
                      <Label htmlFor="due_date">Due Date & Time</Label>
                      <DateTimePicker
                        value={newTask.due_date && newTask.due_time ? new Date(newTask.due_date + 'T' + newTask.due_time) : null}
                        onChange={(date) => {
                          if (date) {
                            setNewTask({
                              ...newTask,
                              due_date: date.toISOString().slice(0, 10),
                              due_time: date.toTimeString().slice(0, 5)
                            });
                          } else {
                            setNewTask({ ...newTask, due_date: "", due_time: "" });
                          }
                        }}
                        placeholder="Pick a date and time"
                        className="w-full"
                      />
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
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <p>No {activeTab.replace('_', ' ')} tasks found.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
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
                      {task.due_date && <><CalendarIcon className="w-3 h-3" /> <span>Due {new Date(task.due_date).toLocaleDateString()} {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></>}
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
                        <Paperclip className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.attachments.length} attachment(s)</span>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {getAvailableStatuses(task.status as TaskStatus).length > 0 ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`${getStatusColor(getAvailableStatuses(task.status as TaskStatus)[0])} transition-colors`}
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus = getNextStatus(task.status as TaskStatus);
                              if (nextStatus) {
                                handleStatusChange(task.id, nextStatus);
                              }
                            }}
                          >
                            {getStatusIcon(getAvailableStatuses(task.status as TaskStatus)[0])}
                            <span className="ml-1 capitalize">Move to {getAvailableStatuses(task.status as TaskStatus)[0].replace('_', ' ')}</span>
                          </Button>
                        ) : (
                          <div className="text-sm text-muted-foreground px-2 py-1">
                            {task.status === 'done' ? 'Task completed' : 'Task cancelled'}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {task.due_date && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDelayTask(task.id, 15)}>
                                Delay 15 minutes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelayTask(task.id, 30)}>
                                Delay 30 minutes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelayTask(task.id, 60)}>
                                Delay 1 hour
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelayTask(task.id, 120)}>
                                Delay 2 hours
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
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
                {selectedTask.due_date && <><CalendarIcon className="w-3 h-3" /> <span>Due {new Date(selectedTask.due_date).toLocaleDateString()} {new Date(selectedTask.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></>}
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
                        {item.completed ? <CheckCircle2 className="text-green-500 w-3 h-3" /> : <span className="inline-block w-3 h-3 border rounded-full border-muted-foreground" />}
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
                      <Paperclip className="w-3 h-3 text-muted-foreground" />
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