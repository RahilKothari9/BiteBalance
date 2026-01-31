import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ui/Toast';

/**
 * Toast Context
 *
 * Provides app-wide toast notification system.
 *
 * Usage:
 * const { toast } = useToast();
 * toast.success('Operation completed!');
 * toast.error('Something went wrong', 'Error Title');
 */

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title, options = {}) => {
    const id = ++toastId;
    const newToast = {
      id,
      type,
      message,
      title,
      duration: options.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, title) => addToast('success', message, title),
    error: (message, title) => addToast('error', message, title),
    warning: (message, title) => addToast('warning', message, title),
    info: (message, title) => addToast('info', message, title),
    custom: (type, message, title, options) => addToast(type, message, title, options),
    dismiss: removeToast,
    dismissAll: () => setToasts([]),
  };

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
