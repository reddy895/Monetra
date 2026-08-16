import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatINR } from '../../utils/formatters';

interface SIPGrowthChartProps {
  data: Array<{
    year: number;
    invested: number;
    wealthGained: number;
    totalValue: number;
  }>;
  height?: number;
}

export const SIPGrowthChart: React.FC<SIPGrowthChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((d) => ({
    year: `Yr ${d.year}`,
    invested: d.invested,
    wealthGained: d.wealthGained,
    totalValue: d.totalValue,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const inv = payload.find((p: any) => p.dataKey === 'invested')?.value || 0;
      const gain = payload.find((p: any) => p.dataKey === 'wealthGained')?.value || 0;
      const total = inv + gain;

      return (
        <div className="bg-surface border border-border p-3 rounded-card shadow-subtle text-xs">
          <p className="font-semibold text-charcoal mb-1.5">{label}</p>
          <div className="space-y-1">
            <p className="text-slate-warm flex justify-between gap-4">
              <span>Invested:</span>
              <span className="font-semibold">{formatINR(inv)}</span>
            </p>
            <p className="text-teal-muted flex justify-between gap-4">
              <span>Est. Returns:</span>
              <span className="font-semibold">+{formatINR(gain)}</span>
            </p>
            <div className="border-t border-border pt-1 font-bold text-charcoal flex justify-between gap-4">
              <span>Total Value:</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A4A4A" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4A4A4A" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5B7F7A" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#5B7F7A" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4E0" />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8E8E8E' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8E8E8E' }}
            tickFormatter={(val) => `₹${val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val >= 1000 ? `${val / 1000}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
          />
          <Area
            type="monotone"
            name="Invested Amount"
            dataKey="invested"
            stackId="1"
            stroke="#4A4A4A"
            fill="url(#colorInvested)"
          />
          <Area
            type="monotone"
            name="Estimated Wealth Gains"
            dataKey="wealthGained"
            stackId="1"
            stroke="#5B7F7A"
            fill="url(#colorGain)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
