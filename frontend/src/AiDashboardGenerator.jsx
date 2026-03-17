import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const barChartData = [
  { region: 'North America', revenue: 45000 },
  { region: 'Europe', revenue: 38000 },
  { region: 'Asia Pacific', revenue: 32000 },
  { region: 'Latin America', revenue: 15000 },
];

const lineChartData = [
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 32000 },
  { month: 'Mar', revenue: 40000 },
  { month: 'Apr', revenue: 38000 },
  { month: 'May', revenue: 48000 },
  { month: 'Jun', revenue: 55000 },
];

const pieChartData = [
  { name: 'SaaS Platform', value: 55 },
  { name: 'API Services', value: 25 },
  { name: 'Consulting', value: 20 },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

function KpiCard({ title, value, unit = '' }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {unit}
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AiDashboardGenerator() {
  const [query, setQuery] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const exampleQueries = [
    'Show monthly revenue by region',
    'Display last 6 months sales trend',
    'Show top 5 selling products',
    'Compare performance of product lines',
  ];

  const handleGenerate = () => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setShowDashboard(false);

    window.setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
    }, 1800);
  };

  const handleExampleQuery = (example) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-100 bg-white px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <span className="text-5xl" aria-hidden="true">
              🚀
            </span>
            <h1 className="text-4xl font-extrabold tracking-tighter text-gray-950 md:text-5xl">
              AI Dashboard Generator
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-xl text-gray-600">
            Ask questions in plain English and get instant, interactive
            insights. Powered by advanced data analytics and your
            organization&apos;s data.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <section className="mb-12 rounded-2xl border border-gray-100 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Show monthly revenue by region..."
              className="flex-grow rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg text-gray-900 outline-none transition duration-150 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex-shrink-0 rounded-xl bg-blue-600 px-10 py-4 text-lg font-semibold text-white transition duration-150 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Generating...</span>
                </span>
              ) : (
                'Generate Dashboard'
              )}
            </button>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-gray-500">
              Try these examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleQuery(example)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition duration-150 hover:border-gray-300 hover:bg-gray-100"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="h-96 animate-pulse rounded-2xl border border-gray-100 bg-white p-8 shadow-sm" />
            <div className="h-96 animate-pulse rounded-2xl border border-gray-100 bg-white p-8 shadow-sm" />
            <div className="col-span-1 grid gap-6 md:col-span-2 md:grid-cols-2">
              <div className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" />
              <div className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" />
            </div>
          </div>
        )}

        {showDashboard && (
          <section className="fade-in grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-950">
                Revenue by Region
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis dataKey="region" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-950">
                Monthly Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={lineChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <KpiCard title="Total Generated Revenue" value="130,000" unit="$" />
                <KpiCard title="Top Performing Region" value="North America" />
                <KpiCard title="Avg. Deal Size" value="8,500" unit="$" />
                <KpiCard title="New Signups" value="2,450" unit="+" />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <h3 className="mb-6 text-xl font-semibold text-gray-950">
                  Product Revenue Share (%)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}
      </main>

      <style>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
