import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee', '#fb923c'];

export const ChartRenderer = ({ chart, data }) => {
  if (!chart || !data || data.length === 0) {
    return null;
  }

  const { type, title, x_key, y_key, category_key } = chart;

  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
  };

  const renderChart = () => {
    switch (type?.toLowerCase()) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey={x_key} angle={-45} textAnchor="end" height={80} stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              cursor={{ fill: '#1e293b' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #475569',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                backgroundColor: '#1e293b',
                color: '#f1f5f9'
              }}
            />
            {category_key ? (
              <Legend />
            ) : null}
            {category_key ? (
              data[0] &&
              Object.keys(data[0])
                ?.filter(key => key !== x_key)
                .map((key, idx) => (
                  <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} />
                ))
            ) : (
              <Bar dataKey={y_key} fill={COLORS[0]} />
            )}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis dataKey={x_key} angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            {category_key ? (
              data[0] &&
              Object.keys(data[0])
                ?.filter(key => key !== x_key)
                .map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                  />
                ))
            ) : (
              <Line type="monotone" dataKey={y_key} stroke={COLORS[0]} strokeWidth={2} />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis dataKey={x_key} angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey={y_key}
              stroke={COLORS[0]}
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey={y_key || Object.keys(data[0])?.[1]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid stroke="#f1f5f9" />
            <XAxis dataKey={x_key} stroke="#94a3b8" />
            <YAxis dataKey={y_key} stroke="#94a3b8" />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Scatter name="Data" data={data} fill={COLORS[0]} />
          </ScatterChart>
        );

      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey={x_key} angle={-45} textAnchor="end" height={80} stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              cursor={{ fill: '#1e293b' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #475569',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                backgroundColor: '#1e293b',
                color: '#f1f5f9'
              }}
            />
            <Bar dataKey={y_key} fill={COLORS[0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
