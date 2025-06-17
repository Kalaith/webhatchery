// Notification management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import type { Notification } from '../../types';

export interface NotificationSlice {
  notifications: Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => {
    const newNotification: Notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      ...notification
    };
    
    const newNotifications = [newNotification, ...state.notifications];
    
    // Keep only the latest 10 notifications
    return {
      notifications: newNotifications.slice(0, 10)
    };
  }),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  
  clearNotifications: () => set(() => ({
    notifications: []
  }))
});
