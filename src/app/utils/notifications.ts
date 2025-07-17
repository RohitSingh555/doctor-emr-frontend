export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
}

export const addNotification = (notification: Omit<Notification, 'timestamp'>) => {
  const fullNotification: Notification = {
    ...notification,
    timestamp: new Date()
  };

  const existingNotifications = localStorage.getItem('taskNotifications');
  const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
  notifications.unshift(fullNotification);
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  localStorage.setItem('taskNotifications', JSON.stringify(notifications));
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('notificationAdded', { detail: fullNotification }));
};

export const getNotifications = (): Notification[] => {
  const storedNotifications = localStorage.getItem('taskNotifications');
  if (!storedNotifications) return [];
  
  const parsed = JSON.parse(storedNotifications);
  return parsed.map((n: any) => ({
    ...n,
    timestamp: new Date(n.timestamp)
  }));
};

export const markNotificationAsRead = (id: string) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notif => 
    notif.id === id ? { ...notif, read: true } : notif
  );
  localStorage.setItem('taskNotifications', JSON.stringify(updatedNotifications));
  
  window.dispatchEvent(new CustomEvent('notificationUpdated'));
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
  localStorage.setItem('taskNotifications', JSON.stringify(updatedNotifications));
  
  window.dispatchEvent(new CustomEvent('notificationUpdated'));
};

export const clearOldNotifications = () => {
  const notifications = getNotifications();
  const now = new Date();
  const filteredNotifications = notifications.filter((n: Notification) => {
    // Keep notifications from the last 24 hours
    return now.getTime() - n.timestamp.getTime() < 24 * 60 * 60 * 1000;
  });
  
  localStorage.setItem('taskNotifications', JSON.stringify(filteredNotifications));
};

export const getUnreadCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
}; 