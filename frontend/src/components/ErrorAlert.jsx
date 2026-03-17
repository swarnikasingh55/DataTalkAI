import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorAlert = ({ error, suggestion, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-900/20 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-300">{error}</h4>
          {suggestion && (
            <p className="mt-1 text-sm text-red-200/80">{suggestion}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-300 transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
