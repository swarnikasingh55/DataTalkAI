import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header = ({ uploadedFile }) => {
  return (
    <header className="border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold">DataTalk AI</h1>
        </div>
        <p className="text-lg text-gray-300 max-w-2xl">
          Transform natural language into instant business intelligence dashboards. Ask questions about your data and get beautiful, interactive visualizations in seconds.
        </p>
        {uploadedFile && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-200 border border-blue-500/30">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Querying: <strong>{uploadedFile}</strong>
          </div>
        )}
      </div>
    </header>
  );
};
