import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'message' | 'bid' | 'system';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message',
    content: 'John Smith: Is this still available?',
    timestamp: '2023-09-15T18:30:00Z',
    read: false,
    actionUrl: '/messages/1',
  },
  {
    id: '2',
    type: 'bid',
    title: 'New bid received',
    content: 'You received a bid of $750 for iPhone 13 Pro',
    timestamp: '2023-09-15T16:45:00Z',
    read: false,
    actionUrl: '/listings/1',
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to Rebazzar!',
    content: 'Start exploring items or list something to sell.',
    timestamp: '2023-09-14T12:00:00Z',
    read: true,
  },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    // In a real app, this would call an API
    setNotifications(mockNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};