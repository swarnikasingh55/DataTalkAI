import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export const SuccessAlert = ({ message, onDismiss, duration = 5000 }) => {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 rounded-lg border border-green-200 bg-green-50 p-4 shadow-lg max-w-sm animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-green-600 hover:text-green-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
