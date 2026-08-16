import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatINR } from '../../utils/formatters';

interface ComparisonBarChartProps {
  actual: {
    needs: number;
    wants: number;
    savings: number;
  };
  ideal: {
    needs: number;
    wants: number;
    savings: number;
  };
  height?: number;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  actual,
  ideal,
  height = 240,
}) => {
  const data = [
    {
      category: 'Needs (50%)',
      Actual: actual.needs,
      Ideal: ideal.needs,
    },
    {
      category: 'Wants (30%)',
      Actual: actual.wants,
      Ideal: ideal.wants,
    },
    {
      category: 'Savings (20%)',
      Actual: actual.savings,
      Ideal: ideal.savings,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-card shadow-subtle text-xs">
          <p className="font-semibold text-charcoal mb-1.5">{label}</p>
          {payload.map((item: any, idx: number) => (
            <p key={idx} className="flex justify-between gap-4" style={{ color: item.color }}>
              <span>{item.name}:</span>
              <span className="font-semibold">{formatINR(item.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4E0" />
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#5A5A5A', fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8E8E8E' }}
            tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
          />
          <Bar dataKey="Actual" fill="#D4A373" radius={[4, 4, 0, 0]} maxBarSize={36} />
          <Bar dataKey="Ideal" fill="#5B7F7A" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
