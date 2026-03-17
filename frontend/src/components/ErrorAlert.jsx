import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorAlert = ({ error, suggestion, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-900">{error}</h4>
          {suggestion && (
            <p className="mt-1 text-sm text-red-800">{suggestion}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-600 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
