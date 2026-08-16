import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatINR } from '../../utils/formatters';

interface CategoryDonutProps {
  data: Array<{
    categoryName: string;
    totalSpent: number;
    color?: string;
    icon?: string;
    percentageOfExpense?: number;
  }>;
  height?: number;
}

const DEFAULT_COLORS = ['#5B7F7A', '#7D9B7A', '#D4A373', '#C47A7A', '#A8A8A8', '#B8A9C9', '#F5A623', '#3498DB'];

export const CategoryDonut: React.FC<CategoryDonutProps> = ({ data, height = 240 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-xs p-4">
        <span className="text-3xl mb-1.5">🎯</span>
        <p className="font-bold text-charcoal">Clean Initial Slate</p>
        <p className="text-charcoal-muted text-[11px] mt-0.5 max-w-xs">
          0 expenses logged this month. Record your first transaction to see category distribution.
        </p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.categoryName,
    value: item.totalSpent,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    icon: item.icon || '🏷️',
    percent: item.percentageOfExpense || 0
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      const pct = total > 0 ? Math.round((pData.value / total) * 100) : 0;
      return (
        <div className="bg-surface border border-border p-2.5 rounded-card shadow-subtle text-xs">
          <p className="font-semibold text-charcoal flex items-center gap-1.5">
            <span>{pData.icon}</span> {pData.name}
          </p>
          <p className="text-teal-muted font-bold mt-1">{formatINR(pData.value)}</p>
          <p className="text-charcoal-muted">{pct}% of total spending</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Clean compact legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 w-full max-w-sm text-xs">
        {chartData.slice(0, 6).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-charcoal truncate">{item.name}</span>
            </div>
            <span className="font-medium text-charcoal-muted tabular-nums ml-2">{formatINR(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
