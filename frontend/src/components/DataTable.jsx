import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const DataTable = ({ data, sql }) => {
  const [expanded, setExpanded] = useState(false);

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);
  const displayRows = expanded ? data : data.slice(0, 5);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Query Details</h3>
        {sql && (
          <div className="rounded-lg bg-gray-900 p-4 overflow-x-auto">
            <p className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-words">
              {sql}
            </p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-gray-900 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} className="px-4 py-3 text-gray-700">
                    {formatValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? 'Show Less' : `Show All (${data.length} rows)`}
        </button>
      )}
    </div>
  );
};

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : value.toFixed(2);
  }
  return String(value);
};
