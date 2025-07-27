/**
 * Toast notification component for user feedback
 * Displays temporary messages for actions and errors
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './EnhancedButton';
import type { Notification, NotificationType } from '../../hooks/useNotifications';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const { id, type, message, duration } = notification;
  
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  return (
    <div className={`
      flex items-center justify-between p-4 mb-3 border rounded-lg shadow-lg
      ${NOTIFICATION_COLORS[type]}
      animate-in slide-in-from-right duration-300
    `}>
      <div className="flex items-center">
        <span className="mr-3 text-lg">
          {NOTIFICATION_ICONS[type]}
        </span>
        <span className="text-sm font-medium">
          {message}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="xs"
        onClick={handleClose}
        className="!p-1 !min-h-0 hover:bg-transparent hover:text-gray-600"
        aria-label="Close notification"
      >
        ✕
      </Button>
    </div>
  );
};

interface ToastContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  const toastContainer = (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-sm">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );

  // Render to portal for proper z-index stacking
  return createPortal(toastContainer, document.body);
};
