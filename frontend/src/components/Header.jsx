import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header = ({ uploadedFile }) => {
  return (
    <header className="border-b border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DataTalk AI</h1>
          </div>
        </div>
        <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
          Transform natural language into intelligent dashboards. Ask questions about your data and get stunning visual insights in seconds.
        </p>
        {uploadedFile && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2 text-sm text-blue-300 border border-blue-500/30 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Querying: <strong className="text-blue-200">{uploadedFile}</strong>
          </div>
        )}
      </div>
    </header>
  );
};
