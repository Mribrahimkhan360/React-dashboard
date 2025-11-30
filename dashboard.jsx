import React, { useState, useEffect } from 'react';

// Simple SVG Icons (replacing lucide-react)
const Icons = {
  Users: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Eye: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Globe: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2 2 0 009.5 8h2a2 2 0 002 2 2 2 0 002-2h1.064M15 20.488V18a2 2 0 013-1.736" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
  Clock: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2}/><polyline points="12 6 12 12 16 14" strokeWidth={2}/></svg>,
  TrendingUp: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth={2}/><polyline points="17 6 23 12 23 6" strokeWidth={2}/></svg>,
  ExternalLink: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Loader2: () => <svg className="w-16 h-16 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>,
};

// Animated Counter
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{count.toLocaleString()}{suffix}</span>;
};

// Stats Card
const StatsCard = 
({ title, value, Icon, trend, color = 'blue' }) => {
  const bg = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }[color];

  return (
    <div className="bg-white rounded-2xl shadow-xl 
    p-6 hover:shadow-2xl transition-all border 
    border-gray-100 w-[100%]">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${bg}`}>
          <Icon className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`px-3 py-1 rounded-full text-sm font-bold 
          ${trend > 0 ? 'bg-green-100 text-green-700' : 
          'bg-red-100 text-red-700'}`}>
            {trend > 0 ? 'Up' : 'Down'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <div className="mt-2"><AnimatedCounter 
      value={value} suffix={title.includes('Time') ? 'm' : ''} />
      </div>
    </div>
  );
};

// Custom Line Chart (Traffic)
const TrafficChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.visits));
  return (
    <div className="bg-white rounded-2xl shadow-xl px-8 pt-8 pb-12 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Icons.TrendingUp className="text-emerald-600 w-8 h-8" />
        Most Visited Category (Last 30 Days)
      </h2>
      <div className="h-80 relative">
        <svg viewBox="0 0 1000 300" className="w-full h-full">
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={300 - y*3} x2="1000" y2={300 - y*3} stroke="#e5e7eb" />
          ))}
          {/* Line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            points={data.map((d, i) => `${i * 1000/(data.length-1)},${300 - (d.visits/max)*280}`).join(' ')}
          />
          {/* Dots */}
          {data.map((d, i) => (
            <circle key={i} cx={i * 1000/(data.length-1)} cy={300 - (d.visits/max)*280} r="6" fill="#3b82f6" />
          ))}
        </svg>
        <div className="flex justify-between mt-1 text-sm text-gray-600 bg-gray-100 p-2">
          {data.map((d, i) => i % 5 === 0 && <span key={i}>{d.date}</span>)}
        </div>
      </div>
    </div>
  );
};

// Custom Pie Chart (Visitors by Country)
const VisitorMap = ({ data }) => {
  const total = data.reduce((a, c) => a + c.value, 0);
  let startAngle = 0;
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Icons.Globe className="text-blue-600 w-8 h-8" />
        GEO Visitor
      </h2>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <svg viewBox="0 0 200 200" className="w-64 h-64">
          {data.map((d, i) => {
            const angle = (d.value / total) * 360;
            const radians = (startAngle * Math.PI) / 180;
            const x1 = 100 + 80 * Math.cos(radians);
            const y1 = 100 + 80 * Math.sin(radians);
            const largeArc = angle > 180 ? 1 : 0;
            const x2 = 100 + 80 * Math.cos((startAngle + angle) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((startAngle + angle) * Math.PI / 180);
            startAngle += angle;
            return (
              <path
                key={i}
                d={`M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]}
              />
            );
          })}
          <circle cx="100" cy="100" r="50" fill="white" />
        </svg>
        <div className="space-y-3 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i] }} />
                <span className="font-medium">{d.name}</span>
              </div>
              <span className="font-bold">{((d.value/total)*100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Custom Bar Chart (Exit Pages)
const ExitPages = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Icons.ExternalLink className="text-red-600 w-8 h-8" />
        Top Exit Pages
      </h2>
      <div className="space-y-6">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{d.page}</span>
              <span>{d.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock Data
const mockTraffic = [
  { date: 'Nov 1', visits: 12400 },
  { date: 'Nov 5', visits: 15600 },
  { date: 'Nov 10', visits: 18200 },
  { date: 'Nov 15', visits: 49800 },
  { date: 'Nov 20', visits: 22300 },
  { date: 'Nov 25', visits: 24500 },
  { date: 'Nov 30', visits: 26800 },
];

const mockCountries = [
  { name: 'Mohammadpur', value: 48500 },
  { name: 'Banasree', value: 28200 },
  { name: 'Dohar', value: 15600 },
  { name: 'Dhamrai', value: 9800 },
  { name: 'Savar', value: 7200 },
];

const mockExitPages = [
  { page: '/checkout', value: 12400 },
  { page: '/pricing', value: 9800 },
  { page: '/login', value: 7600 },
  { page: '/blog/old', value: 5400 },
  { page: '/docs/v1', value: 4200 },
];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [period]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader2 />
      </div>
    );
  }

  return (
    <div className="pt-18 px-2 margin-bottom-0 minWidth-width-79-80 category-w-100 pb-2 mt-10">
      <div className="mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Analytics Dashboard</h1>

        <div className="flex flex-wrap gap-4 mb-12">
          {['today', 'week', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${period === p ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl' : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatsCard title="Total Visitors" value={125420} Icon={Icons.Users} trend={12} color="blue" />
          <StatsCard title="Unique Visitors" value={89234} Icon={Icons.Eye} trend={8} color="green" />
          <StatsCard title="New Visit" value={742105} Icon={Icons.TrendingUp} trend={18} color="purple" />
          <StatsCard title="Avg. Time (mins)" value={3} Icon={Icons.Clock} trend={-5} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <TrafficChart data={mockTraffic} />
          <VisitorMap data={mockCountries} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6"> Most Visited Pages</h2>
            {['Home', 'Pricing', 'Blog', 'About', 'Contact'].map((p, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-3">
                <span className="font-medium">{p}</span>
                <span className="font-bold text-blue-600">{(89234 - i*12000).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <ExitPages data={mockExitPages} />
        </div>
      </div>
    </div>
  );
}
