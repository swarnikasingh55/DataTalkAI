import React from 'react';

export const MetricsGrid = ({ rowCount, dataSource, insight }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <p className="text-sm font-medium text-slate-400 mb-2">Rows Returned</p>
        <p className="text-4xl font-bold text-blue-400">{rowCount || 0}</p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <p className="text-sm font-medium text-slate-400 mb-2">Data Source</p>
        <p className="text-lg font-semibold text-slate-200 break-words">{dataSource}</p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <p className="text-sm font-medium text-slate-400 mb-2">Key Insight</p>
        <p className="text-slate-300 line-clamp-3">{insight || 'Your insights will appear here.'}</p>
      </div>
    </div>
  );
};
