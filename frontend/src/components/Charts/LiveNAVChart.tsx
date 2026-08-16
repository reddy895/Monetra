import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatINR } from '../../utils/formatters';

interface LiveNAVChartProps {
  data: Array<{ date: string; nav: number; timestamp?: number }>;
  period: string;
  onPeriodChange: (p: string) => void;
  latestNav: number;
  height?: number;
}

export const LiveNAVChart: React.FC<LiveNAVChartProps> = ({
  data,
  period,
  onPeriodChange,
  latestNav,
  height = 260,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-background rounded-card border border-border text-xs text-charcoal-muted"
      >
        Fetching live AMFI daily NAV history...
      </div>
    );
  }

  const navs = data.map((d) => d.nav);
  const minNav = Math.min(...navs);
  const maxNav = Math.max(...navs);
  const firstNav = navs[0] || latestNav;
  const isPositive = latestNav >= firstNav;
  const strokeColor = isPositive ? '#5B7F7A' : '#C47A7A';
  const fillColor = isPositive ? '#5B7F7A' : '#C47A7A';

  // Domain with 2% breathing room
  const yMin = Math.floor(minNav * 0.98 * 100) / 100;
  const yMax = Math.ceil(maxNav * 1.02 * 100) / 100;

  const periods = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];

  return (
    <div className="space-y-3">
      {/* Timeframe selector bar & Period Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-[10px] text-charcoal-light uppercase font-semibold">Period Low: </span>
            <span className="font-bold text-charcoal tabular-nums">₹{minNav.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-charcoal-light uppercase font-semibold">Period High: </span>
            <span className="font-bold text-charcoal tabular-nums">₹{maxNav.toFixed(2)}</span>
          </div>
        </div>

        {/* Timeframe pill buttons */}
        <div className="flex items-center gap-1 bg-background p-0.5 rounded-card border border-border">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all duration-150 ${
                period === p
                  ? 'bg-teal-muted text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-slate-subtle'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time NAV Area Chart */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#A8A4A0"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#E8E4E0' }}
              minTickGap={25}
            />
            <YAxis
              domain={[yMin, yMax]}
              stroke="#A8A4A0"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#E8E4E0' }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  const diff = pt.nav - firstNav;
                  const diffPct = ((diff / firstNav) * 100).toFixed(2);

                  return (
                    <div className="bg-surface p-3 rounded-card border border-border shadow-card text-xs">
                      <p className="text-[10px] font-semibold text-charcoal-light uppercase">{pt.date}</p>
                      <p className="font-bold text-sm text-charcoal tabular-nums mt-0.5">
                        NAV: ₹{Number(pt.nav).toFixed(4)}
                      </p>
                      <p className={`text-[11px] font-semibold mt-0.5 ${diff >= 0 ? 'text-success-dark' : 'text-danger'}`}>
                        {diff >= 0 ? `+${diffPct}%` : `${diffPct}%`} since period start
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={firstNav} stroke="#D4A373" strokeDasharray="3 3" opacity={0.6} />
            <Area
              type="monotone"
              dataKey="nav"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#navGradient)"
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
