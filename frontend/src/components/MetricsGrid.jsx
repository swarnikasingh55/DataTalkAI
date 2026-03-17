import React from 'react';

export const MetricsGrid = ({ rowCount, dataSource, insight }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-600 mb-2">Rows Returned</p>
        <p className="text-3xl font-bold text-gray-900">{rowCount || 0}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-600 mb-2">Data Source</p>
        <p className="text-lg font-semibold text-gray-900 break-words">{dataSource}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-600 mb-2">Key Insight</p>
        <p className="text-gray-900 line-clamp-3">{insight || 'Your insights will appear here.'}</p>
      </div>
    </div>
  );
};
