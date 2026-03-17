import React from 'react';

export const LoadingSkeleton = ({ gridCols = 2 }) => {
  return (
    <div className="space-y-6">
      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton rounded-lg border border-gray-200 bg-white p-6 h-24" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className={`grid grid-cols-1 gap-6 md:grid-cols-${gridCols}`}>
        {[1, 2].map((i) => (
          <div key={i} className="skeleton rounded-lg border border-gray-200 bg-white p-6 h-80" />
        ))}
      </div>

      {/* Data Table Skeleton */}
      <div className="skeleton rounded-lg border border-gray-200 bg-white p-6 h-64" />
    </div>
  );
};
