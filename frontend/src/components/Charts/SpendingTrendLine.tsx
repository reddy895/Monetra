import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatINR } from '../../utils/formatters';

interface SpendingTrendLineProps {
  data: Array<{ _id: string; total: number; count?: number }>;
  height?: number;
}

export const SpendingTrendLine: React.FC<SpendingTrendLineProps> = ({ data, height = 220 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-44 text-center text-xs p-4">
        <span className="text-3xl mb-1.5">📈</span>
        <p className="font-bold text-charcoal">No Daily Expenses Yet</p>
        <p className="text-charcoal-muted text-[11px] mt-0.5 max-w-xs">
          Daily spending velocity timeline will plot automatically as you add expenses.
        </p>
      </div>
    );
  }

  const chartData = data.map(d => {
    const parts = d._id.split('-');
    const day = parts.length === 3 ? `${parts[2]}` : d._id;
    return {
      day: `Day ${day}`,
      rawDate: d._id,
      amount: d.total
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-surface border border-border p-2.5 rounded-card shadow-subtle text-xs">
          <p className="text-charcoal-muted font-medium">{pData.rawDate}</p>
          <p className="text-teal-muted font-bold text-sm mt-0.5">{formatINR(pData.amount)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5B7F7A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#5B7F7A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4E0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8E8E8E' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8E8E8E' }}
            tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#5B7F7A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSpend)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
