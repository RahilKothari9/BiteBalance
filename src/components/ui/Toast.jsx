import React, { useState, useEffect } from 'react';

/**
 * Toast Component
 *
 * Individual toast notification.
 * Types: success, error, warning, info
 */

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const styles = {
  success: {
    border: 'border-l-teal',
    icon: 'bg-teal text-white',
    progress: 'bg-teal',
  },
  error: {
    border: 'border-l-error',
    icon: 'bg-error text-white',
    progress: 'bg-error',
  },
  warning: {
    border: 'border-l-gold',
    icon: 'bg-gold text-charcoal',
    progress: 'bg-gold',
  },
  info: {
    border: 'border-l-coral',
    icon: 'bg-coral text-white',
    progress: 'bg-coral',
  },
};

const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onDismiss,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const style = styles[type];

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.(id);
    }, 200);
  };

  return (
    <div
      className={`
        relative
        w-full max-w-sm
        bg-white
        rounded-xl
        shadow-xl
        border border-sand
        border-l-4
        ${style.border}
        overflow-hidden
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
      `}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${style.icon}`}>
          {icons[type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-charcoal text-sm">
              {title}
            </p>
          )}
          {message && (
            <p className={`text-sm text-warm-gray ${title ? 'mt-0.5' : ''}`}>
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-stone hover:text-charcoal transition-colors rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="h-1 bg-sand">
          <div
            className={`h-full ${style.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * ToastContainer Component
 *
 * Container for toast notifications. Fixed position bottom-right.
 */
const ToastContainer = ({ toasts = [], onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-toast flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;
