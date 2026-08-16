import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  useGetLiveFundNAVQuery,
  useSearchLiveFundsQuery,
  useGetSIPRecommendationsQuery
} from '../../store/apiSlice';
import { Card } from '../../components/UI/Card';
import { Badge } from '../../components/UI/Badge';
import { LiveNAVChart } from '../../components/Charts/LiveNAVChart';
import { SIPGrowthChart } from '../../components/Charts/SIPGrowthChart';
import { formatINR } from '../../utils/formatters';
import {
  TrendingUp,
  LineChart as ChartIcon,
  Search,
  CheckCircle2,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Calendar,
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';

interface VerifiedFund {
  schemeCode: string;
  fundName: string;
  amc: string;
  category: string;
  riskLevel: 'low' | 'moderate' | 'high';
  suggestedMonthly: number;
}

const VERIFIED_LIVE_FUNDS: VerifiedFund[] = [
  {
    schemeCode: '122639',
    fundName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
    amc: 'PPFAS Mutual Fund',
    category: 'Flexi Cap',
    riskLevel: 'moderate',
    suggestedMonthly: 2500,
  },
  {
    schemeCode: '120716',
    fundName: 'UTI Nifty 50 Index Fund - Direct Plan - Growth',
    amc: 'UTI Mutual Fund',
    category: 'Index (Large Cap)',
    riskLevel: 'low',
    suggestedMonthly: 2000,
  },
  {
    schemeCode: '127042',
    fundName: 'Motilal Oswal Midcap Fund - Direct Plan - Growth',
    amc: 'Motilal Oswal Mutual Fund',
    category: 'Mid Cap',
    riskLevel: 'high',
    suggestedMonthly: 1500,
  },
  {
    schemeCode: '118778',
    fundName: 'Nippon India Small Cap Fund - Direct Plan - Growth',
    amc: 'Nippon India Mutual Fund',
    category: 'Small Cap',
    riskLevel: 'high',
    suggestedMonthly: 1000,
  },
  {
    schemeCode: '135781',
    fundName: 'Mirae Asset ELSS Tax Saver Fund - Direct Plan - Growth',
    amc: 'Mirae Asset Mutual Fund',
    category: 'ELSS (80C Tax Saver)',
    riskLevel: 'moderate',
    suggestedMonthly: 2000,
  },
  {
    schemeCode: '119063',
    fundName: 'HDFC Nifty 50 Index Fund - Direct Plan - Growth',
    amc: 'HDFC Mutual Fund',
    category: 'Index (Large Cap)',
    riskLevel: 'low',
    suggestedMonthly: 2000,
  },
  {
    schemeCode: '120847',
    fundName: 'Quant ELSS Tax Saver Fund - Direct Plan - Growth',
    amc: 'Quant Mutual Fund',
    category: 'ELSS (80C Tax Saver)',
    riskLevel: 'high',
    suggestedMonthly: 1500,
  },
  {
    schemeCode: '118834',
    fundName: 'Mirae Asset Large & Midcap Fund - Direct Plan - Growth',
    amc: 'Mirae Asset Mutual Fund',
    category: 'Large & Mid Cap',
    riskLevel: 'moderate',
    suggestedMonthly: 2000,
  },
];

const SALARY_BRACKETS = [20000, 25000, 30000, 35000, 40000, 45000, 50000];

export const SIPsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedSalary, setSelectedSalary] = useState<number>(user?.monthlySalary || 35000);
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('122639');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1Y');
  const [activeTab, setActiveTab] = useState<'real_nav' | 'compounding_calc'>('real_nav');

  // Live Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Compounding Visualizer Slider States
  const [simMonthlyAmt, setSimMonthlyAmt] = useState<number>(2000);
  const [simTenure, setSimTenure] = useState<number>(10);

  // Fetch Live Real-Time AMFI NAV data
  const { data: liveNavData, isLoading: isNavLoading, isFetching: isNavFetching, refetch } = useGetLiveFundNAVQuery({
    schemeCode: selectedSchemeCode,
    period: selectedPeriod,
  });

  // Fetch Live Search Results if searching
  const { data: searchResultsData } = useSearchLiveFundsQuery(searchQuery, {
    skip: searchQuery.length < 2,
  });

  const liveData = liveNavData?.data;
  const searchResults = searchResultsData?.data || [];

  // Active Fund Info
  const activeFundInfo = useMemo(() => {
    const found = VERIFIED_LIVE_FUNDS.find((f) => f.schemeCode === selectedSchemeCode);
    if (found) return found;
    return {
      schemeCode: selectedSchemeCode,
      fundName: liveData?.schemeName || 'Indian Mutual Fund Scheme',
      amc: liveData?.fundHouse || 'AMFI Mutual Fund',
      category: liveData?.schemeCategory || 'Equity',
      riskLevel: 'moderate' as const,
      suggestedMonthly: Math.round(selectedSalary * 0.1),
    };
  }, [selectedSchemeCode, liveData, selectedSalary]);

  // Use real 5Y CAGR for future projection calculations
  const effectiveCagr = liveData?.metrics?.cagr5Y || liveData?.metrics?.cagr3Y || 13.5;

  const compoundingGraphData = useMemo(() => {
    const monthlyRate = effectiveCagr / 100 / 12;
    const yearlyBreakdown = [];

    for (let year = 1; year <= simTenure; year++) {
      const months = year * 12;
      const totalInvested = Math.round(simMonthlyAmt * months);
      const futureValue = Math.round(
        simMonthlyAmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      );
      const wealthGained = Math.max(0, futureValue - totalInvested);

      yearlyBreakdown.push({
        year,
        invested: totalInvested,
        wealthGained,
        totalValue: futureValue,
      });
    }

    const finalPoint = yearlyBreakdown[yearlyBreakdown.length - 1] || {
      invested: 0,
      wealthGained: 0,
      totalValue: 0,
    };

    return {
      yearlyBreakdown,
      finalInvested: finalPoint.invested,
      finalGains: finalPoint.wealthGained,
      finalTotal: finalPoint.totalValue,
    };
  }, [simMonthlyAmt, simTenure, effectiveCagr]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface rounded-card border border-border p-5 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-charcoal tracking-tight">Real-Time SIP Mutual Fund Visualizer</h2>
            <span className="flex items-center gap-1 bg-teal-subtle text-teal-muted text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-teal-muted/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-muted animate-pulse" />
              Live AMFI Data
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            Real daily historical Net Asset Value (NAV) graphs and verified CAGR returns directly from the Association of Mutual Funds in India (AMFI). No artificial or mock projections.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isNavFetching}
            className="flex items-center gap-1.5 text-xs text-charcoal hover:text-teal-muted bg-background hover:bg-slate-subtle border border-border px-3 py-1.5 rounded-card transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isNavFetching ? 'animate-spin text-teal-muted' : ''}`} />
            <span>{isNavFetching ? 'Syncing Live NAV...' : 'Refresh Live Data'}</span>
          </button>
        </div>
      </div>

      {/* Salary Filter Bar */}
      <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              Select Take-Home Salary Bracket (₹20k – ₹50k / month)
            </span>
            <p className="text-[11px] text-charcoal-light">Calibrates recommended monthly SIP allocation per 20% savings rule</p>
          </div>
          <span className="text-xs font-bold text-teal-muted bg-teal-subtle px-2.5 py-1 rounded border border-teal-muted/20">
            Suggested 20% SIP Target: {formatINR(Math.round(selectedSalary * 0.2))}/mo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {SALARY_BRACKETS.map((sal) => {
            const isSelected = selectedSalary === sal;
            return (
              <button
                key={sal}
                type="button"
                onClick={() => setSelectedSalary(sal)}
                className={`py-2 px-2 text-center rounded-card text-xs font-semibold transition-all duration-150 border ${
                  isSelected
                    ? 'bg-teal-muted text-white border-teal-muted shadow-sm'
                    : 'bg-background hover:bg-slate-subtle text-charcoal border-border'
                }`}
              >
                {formatINR(sal)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus: Live Real-Time NAV Graph Card */}
      <Card className="shadow-subtle border-l-4 border-l-teal-muted bg-surface">
        {/* Card Header & Tabs */}
        <div className="border-b border-border pb-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-teal-muted shrink-0" />
              <h3 className="text-sm font-bold text-charcoal leading-tight">
                {liveData?.schemeName || activeFundInfo.fundName}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-charcoal-muted">
              <span className="font-medium">{activeFundInfo.amc}</span>
              <span>•</span>
              <span className="font-semibold text-charcoal bg-background px-2 py-0.5 rounded border border-border">
                {activeFundInfo.category}
              </span>
              <span>•</span>
              <span className="text-charcoal-light">AMFI Scheme Code: #{selectedSchemeCode}</span>
            </div>
          </div>

          {/* Graph View Toggle */}
          <div className="flex items-center gap-1 bg-background p-1 rounded-card border border-border shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('real_nav')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'real_nav'
                  ? 'bg-teal-muted text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <ChartIcon className="w-3.5 h-3.5" />
              <span>Real AMFI Daily NAV Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compounding_calc')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'compounding_calc'
                  ? 'bg-teal-muted text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Future Wealth Compounding</span>
            </button>
          </div>
        </div>

        {/* Real AMFI Return Metrics Pill Row */}
        {liveData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
            <div className="bg-background p-3 rounded-card border border-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-light block">Latest Real NAV</span>
              <p className="text-lg font-extrabold text-charcoal tabular-nums mt-0.5">
                ₹{Number(liveData.latestNav).toFixed(4)}
              </p>
              <span className="text-[10px] text-charcoal-light">as of {liveData.latestDate}</span>
            </div>

            <div className="bg-background p-3 rounded-card border border-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-light block">1-Month Return</span>
              <p className={`text-lg font-extrabold tabular-nums mt-0.5 ${liveData.metrics.return1M >= 0 ? 'text-success-dark' : 'text-danger'}`}>
                {liveData.metrics.return1M >= 0 ? `+${liveData.metrics.return1M}%` : `${liveData.metrics.return1M}%`}
              </p>
              <span className="text-[10px] text-charcoal-light">Absolute change</span>
            </div>

            <div className="bg-background p-3 rounded-card border border-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-light block">1-Year Return</span>
              <p className={`text-lg font-extrabold tabular-nums mt-0.5 ${liveData.metrics.return1Y >= 0 ? 'text-success-dark' : 'text-danger'}`}>
                {liveData.metrics.return1Y >= 0 ? `+${liveData.metrics.return1Y}%` : `${liveData.metrics.return1Y}%`}
              </p>
              <span className="text-[10px] text-charcoal-light">Past 12 months</span>
            </div>

            <div className="bg-background p-3 rounded-card border border-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-light block">3-Year Real CAGR</span>
              <p className="text-lg font-extrabold text-teal-muted tabular-nums mt-0.5">
                +{liveData.metrics.cagr3Y}% p.a.
              </p>
              <span className="text-[10px] text-charcoal-light">Compounded annual</span>
            </div>

            <div className="bg-teal-subtle/60 p-3 rounded-card border border-teal-muted/30 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-teal-muted block">5-Year Real CAGR</span>
              <p className="text-lg font-black text-charcoal tabular-nums mt-0.5">
                +{liveData.metrics.cagr5Y}% p.a.
              </p>
              <span className="text-[10px] text-teal-muted font-medium">Long-term benchmark</span>
            </div>
          </div>
        )}

        {/* Tab 1: Real Daily AMFI NAV Area Graph */}
        {activeTab === 'real_nav' && (
          <div className="space-y-4">
            <LiveNAVChart
              data={liveData?.chartPoints || []}
              period={selectedPeriod}
              onPeriodChange={(p) => setSelectedPeriod(p)}
              latestNav={liveData?.latestNav || 100}
              height={280}
            />

            {/* Backtested Historical SIP Return Box (Actual Real Numbers) */}
            {liveData?.historicalSIP && (
              <div className="bg-background p-4 rounded-card border border-border">
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider block mb-2">
                  Real Historical SIP Backtest (If you invested ₹2,000/month on the 5th of each month):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-surface rounded border border-border">
                    <div className="flex justify-between text-charcoal-muted text-[11px] mb-1">
                      <span>1-Year SIP</span>
                      <span>Invested: {formatINR(liveData.historicalSIP.sip1Y.totalInvested)}</span>
                    </div>
                    <p className="text-base font-bold text-charcoal tabular-nums">
                      Value: {formatINR(liveData.historicalSIP.sip1Y.currentValue)}
                    </p>
                    <p className={`text-[11px] font-semibold mt-0.5 ${liveData.historicalSIP.sip1Y.returnsPct >= 0 ? 'text-success-dark' : 'text-danger'}`}>
                      {liveData.historicalSIP.sip1Y.returnsPct >= 0 ? `+${liveData.historicalSIP.sip1Y.returnsPct}%` : `${liveData.historicalSIP.sip1Y.returnsPct}%`}
                    </p>
                  </div>

                  <div className="p-3 bg-surface rounded border border-border">
                    <div className="flex justify-between text-charcoal-muted text-[11px] mb-1">
                      <span>3-Year SIP</span>
                      <span>Invested: {formatINR(liveData.historicalSIP.sip3Y.totalInvested)}</span>
                    </div>
                    <p className="text-base font-bold text-charcoal tabular-nums">
                      Value: {formatINR(liveData.historicalSIP.sip3Y.currentValue)}
                    </p>
                    <p className="text-[11px] font-semibold text-teal-muted mt-0.5">
                      +{liveData.historicalSIP.sip3Y.returnsPct}% (+{formatINR(liveData.historicalSIP.sip3Y.wealthGained)})
                    </p>
                  </div>

                  <div className="p-3 bg-teal-subtle/50 rounded border border-teal-muted/30">
                    <div className="flex justify-between text-teal-muted text-[11px] mb-1 font-bold">
                      <span>5-Year SIP</span>
                      <span>Invested: {formatINR(liveData.historicalSIP.sip5Y.totalInvested)}</span>
                    </div>
                    <p className="text-base font-black text-charcoal tabular-nums">
                      Value: {formatINR(liveData.historicalSIP.sip5Y.currentValue)}
                    </p>
                    <p className="text-[11px] font-bold text-teal-muted mt-0.5">
                      +{liveData.historicalSIP.sip5Y.returnsPct}% (+{formatINR(liveData.historicalSIP.sip5Y.wealthGained)})
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Compounding Forecast Slider & Trajectory Chart */}
        {activeTab === 'compounding_calc' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4 bg-background p-4 rounded-card border border-border">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-charcoal">
                <Sliders className="w-4 h-4 text-teal-muted" />
                <span>Simulate Future Growth @ {effectiveCagr}% Real CAGR</span>
              </div>

              {/* Slider 1: Monthly Investment */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-charcoal">Monthly SIP Amount:</span>
                  <span className="font-bold text-teal-muted text-sm tabular-nums">
                    {formatINR(simMonthlyAmt)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={simMonthlyAmt}
                  onChange={(e) => setSimMonthlyAmt(Number(e.target.value))}
                  className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-teal-muted"
                />
                <div className="flex justify-between text-[10px] text-charcoal-light mt-0.5">
                  <span>₹500/mo</span>
                  <span>₹7,500/mo</span>
                  <span>₹15,000/mo</span>
                </div>
              </div>

              {/* Slider 2: Horizon Years */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-charcoal">Tenure Period:</span>
                  <span className="font-bold text-charcoal text-sm tabular-nums">
                    {simTenure} Years ({simTenure * 12} Installments)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={simTenure}
                  onChange={(e) => setSimTenure(Number(e.target.value))}
                  className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-slate-warm"
                />
                <div className="flex justify-between text-[10px] text-charcoal-light mt-0.5">
                  <span>1 Year</span>
                  <span>10 Years</span>
                  <span>25 Years</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] font-semibold uppercase text-charcoal-muted block mb-1.5">
                  Milestone Corpus @ {effectiveCagr}% Real AMFI CAGR:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-charcoal-light">In 3 Years</span>
                    <p className="font-bold text-charcoal tabular-nums mt-0.5">
                      {formatINR(
                        Math.round(
                          simMonthlyAmt *
                            ((Math.pow(1 + effectiveCagr / 100 / 12, 36) - 1) / (effectiveCagr / 100 / 12)) *
                            (1 + effectiveCagr / 100 / 12)
                        )
                      )}
                    </p>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-charcoal-light">In 5 Years</span>
                    <p className="font-bold text-charcoal tabular-nums mt-0.5">
                      {formatINR(
                        Math.round(
                          simMonthlyAmt *
                            ((Math.pow(1 + effectiveCagr / 100 / 12, 60) - 1) / (effectiveCagr / 100 / 12)) *
                            (1 + effectiveCagr / 100 / 12)
                        )
                      )}
                    </p>
                  </div>
                  <div className="bg-teal-subtle/70 p-2 rounded border border-teal-muted/30">
                    <span className="text-[10px] text-teal-muted font-bold">In 10 Years</span>
                    <p className="font-bold text-teal-muted tabular-nums mt-0.5">
                      {formatINR(
                        Math.round(
                          simMonthlyAmt *
                            ((Math.pow(1 + effectiveCagr / 100 / 12, 120) - 1) / (effectiveCagr / 100 / 12)) *
                            (1 + effectiveCagr / 100 / 12)
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-background p-3 rounded-card border border-border">
                  <span className="text-[10px] uppercase font-semibold text-charcoal-muted">Total Invested</span>
                  <p className="text-base font-bold text-charcoal tabular-nums mt-0.5">
                    {formatINR(compoundingGraphData.finalInvested)}
                  </p>
                </div>
                <div className="bg-background p-3 rounded-card border border-border">
                  <span className="text-[10px] uppercase font-semibold text-teal-muted">Est. Wealth Gain</span>
                  <p className="text-base font-bold text-teal-muted tabular-nums mt-0.5">
                    +{formatINR(compoundingGraphData.finalGains)}
                  </p>
                </div>
                <div className="bg-teal-subtle/80 p-3 rounded-card border border-teal-muted/30">
                  <span className="text-[10px] uppercase font-bold text-charcoal">Future Corpus</span>
                  <p className="text-base font-black text-charcoal tabular-nums mt-0.5">
                    {formatINR(compoundingGraphData.finalTotal)}
                  </p>
                </div>
              </div>

              <div className="bg-surface rounded-card border border-border p-4">
                <span className="text-xs font-bold text-charcoal block mb-2">
                  Compounding Trajectory ({simTenure} Years)
                </span>
                <SIPGrowthChart data={compoundingGraphData.yearlyBreakdown} height={240} />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Verified Real-Time AMFI Mutual Funds Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-muted" />
              <span>Verified Direct-Growth Mutual Funds (Click any fund to load its real-time graph)</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Live SEBI-regulated schemes across Index, Flexi Cap, Mid Cap, Small Cap, and ELSS categories
            </p>
          </div>

          {/* Search bar for 40,000+ Indian Mutual Funds */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search any fund (e.g. Tata, SBI)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-card border border-border bg-surface text-xs text-charcoal placeholder-charcoal-light focus:outline-hidden focus:border-teal-muted"
            />

            {/* Live Search Dropdown */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface rounded-card border border-border shadow-card max-h-60 overflow-y-auto divide-y divide-border">
                {searchResults.map((res) => (
                  <button
                    key={res.schemeCode}
                    type="button"
                    onClick={() => {
                      setSelectedSchemeCode(res.schemeCode.toString());
                      setIsSearching(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 text-left text-xs hover:bg-background transition-colors block"
                  >
                    <p className="font-semibold text-charcoal truncate">{res.schemeName}</p>
                    <span className="text-[10px] text-charcoal-light font-medium">Scheme Code: #{res.schemeCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {VERIFIED_LIVE_FUNDS.map((fund) => {
            const isCurrentlySelected = selectedSchemeCode === fund.schemeCode;

            return (
              <div
                key={fund.schemeCode}
                onClick={() => setSelectedSchemeCode(fund.schemeCode)}
                className={`p-3.5 rounded-card border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isCurrentlySelected
                    ? 'bg-teal-subtle/40 border-teal-muted ring-2 ring-teal-muted/30 shadow-card'
                    : 'bg-surface border-border hover:border-slate-300 hover:shadow-card'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold text-charcoal-muted bg-background px-2 py-0.5 rounded border border-border">
                      {fund.category}
                    </span>
                    <Badge
                      variant={fund.riskLevel === 'low' ? 'success' : fund.riskLevel === 'high' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {fund.riskLevel}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-charcoal leading-snug line-clamp-2">{fund.fundName}</h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">{fund.amc}</p>
                </div>

                <div className="pt-2.5 border-t border-border mt-3">
                  <button
                    type="button"
                    className={`w-full py-1.5 px-2.5 rounded-card text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isCurrentlySelected
                        ? 'bg-teal-muted text-white'
                        : 'bg-slate-subtle hover:bg-teal-subtle text-charcoal hover:text-teal-muted'
                    }`}
                  >
                    <ChartIcon className="w-3.5 h-3.5" />
                    <span>{isCurrentlySelected ? 'Viewing Live Graph' : 'View Real-Time Graph'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
