const https = require('https');
const { SIP, SIPPerformance, InvestmentRecommendation, User } = require('../models');
const { calculateXIRR, calculateSIPFutureValue } = require('../utils/xirr');

// In-memory cache for live MF API responses (1 hour TTL)
const navCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

// Fetch helper from https://api.mfapi.in
const fetchFromMFAPI = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid JSON received from MF API'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const getLiveFundNAV = async (schemeCode, period = '1Y') => {
  const cached = navCache.get(schemeCode);
  let rawData = null;

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    rawData = cached.data;
  } else {
    try {
      rawData = await fetchFromMFAPI(`https://api.mfapi.in/mf/${schemeCode}`);
      if (rawData && rawData.data) {
        navCache.set(schemeCode, { data: rawData, timestamp: Date.now() });
      }
    } catch (err) {
      console.error('MF API fetch error:', err.message);
      if (cached) rawData = cached.data; // fallback to stale cache
    }
  }

  if (!rawData || !rawData.data || rawData.data.length === 0) {
    throw new Error(`Could not fetch live NAV data for scheme code ${schemeCode}`);
  }

  const allNavs = rawData.data; // Array of { date: 'DD-MM-YYYY', nav: '91.68340' }
  const meta = rawData.meta;
  const latestNavObj = allNavs[0];
  const latestNav = parseFloat(latestNavObj.nav);

  // Helper to parse 'DD-MM-YYYY' into Date
  const parseMFDate = (dStr) => {
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    return new Date(dStr);
  };

  const now = parseMFDate(latestNavObj.date);

  // Compute returns for standard timeframes
  const findNavAtYearsAgo = (years) => {
    const targetDate = new Date(now);
    targetDate.setFullYear(targetDate.getFullYear() - years);
    for (let i = 0; i < allNavs.length; i++) {
      const d = parseMFDate(allNavs[i].date);
      if (d <= targetDate) {
        return parseFloat(allNavs[i].nav);
      }
    }
    return parseFloat(allNavs[allNavs.length - 1].nav);
  };

  const findNavAtMonthsAgo = (months) => {
    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() - months);
    for (let i = 0; i < allNavs.length; i++) {
      const d = parseMFDate(allNavs[i].date);
      if (d <= targetDate) {
        return parseFloat(allNavs[i].nav);
      }
    }
    return parseFloat(allNavs[allNavs.length - 1].nav);
  };

  const nav1M = findNavAtMonthsAgo(1);
  const nav6M = findNavAtMonthsAgo(6);
  const nav1Y = findNavAtYearsAgo(1);
  const nav3Y = findNavAtYearsAgo(3);
  const nav5Y = findNavAtYearsAgo(5);
  const oldestNav = parseFloat(allNavs[allNavs.length - 1].nav);

  const return1M = Math.round(((latestNav - nav1M) / nav1M) * 10000) / 100;
  const return6M = Math.round(((latestNav - nav6M) / nav6M) * 10000) / 100;
  const return1Y = Math.round(((latestNav - nav1Y) / nav1Y) * 10000) / 100;
  const cagr3Y = Math.round((Math.pow(latestNav / nav3Y, 1 / 3) - 1) * 10000) / 100;
  const cagr5Y = Math.round((Math.pow(latestNav / nav5Y, 1 / 5) - 1) * 10000) / 100;

  // Filter NAV historical points for chart based on period
  let targetCutoff = new Date(now);
  if (period === '1M') targetCutoff.setMonth(targetCutoff.getMonth() - 1);
  else if (period === '6M') targetCutoff.setMonth(targetCutoff.getMonth() - 6);
  else if (period === '1Y') targetCutoff.setFullYear(targetCutoff.getFullYear() - 1);
  else if (period === '3Y') targetCutoff.setFullYear(targetCutoff.getFullYear() - 3);
  else if (period === '5Y') targetCutoff.setFullYear(targetCutoff.getFullYear() - 5);
  else targetCutoff = new Date(1990, 0, 1);

  const filteredPoints = [];
  for (let i = allNavs.length - 1; i >= 0; i--) {
    const d = parseMFDate(allNavs[i].date);
    if (d >= targetCutoff) {
      filteredPoints.push({
        date: allNavs[i].date,
        nav: parseFloat(allNavs[i].nav),
        timestamp: d.getTime()
      });
    }
  }

  // Downsample to ~60-100 points for silky smooth UI charting if data is dense
  const step = Math.max(1, Math.floor(filteredPoints.length / 80));
  const sampledPoints = filteredPoints.filter((_, idx) => idx % step === 0 || idx === filteredPoints.length - 1);

  // Compute real historical SIP backtest (e.g. ₹2,000/mo over 1Y, 3Y, 5Y using real AMFI NAVs)
  const calculateHistoricalSIPValue = (monthlyAmt, years) => {
    let units = 0;
    const months = years * 12;
    let totalInvested = monthlyAmt * months;

    const startDate = new Date(now);
    startDate.setFullYear(startDate.getFullYear() - years);

    for (let m = 0; m < months; m++) {
      const pmtDate = new Date(startDate);
      pmtDate.setMonth(pmtDate.getMonth() + m);

      // Find nearest NAV
      let bestNav = latestNav;
      for (let k = allNavs.length - 1; k >= 0; k--) {
        const nd = parseMFDate(allNavs[k].date);
        if (nd >= pmtDate) {
          bestNav = parseFloat(allNavs[k].nav);
          break;
        }
      }
      if (bestNav > 0) {
        units += monthlyAmt / bestNav;
      }
    }

    const currentValue = Math.round(units * latestNav);
    const returnsPct = totalInvested > 0 ? Math.round(((currentValue - totalInvested) / totalInvested) * 10000) / 100 : 0;

    return {
      monthlyAmt,
      years,
      totalInvested,
      currentValue,
      wealthGained: currentValue - totalInvested,
      returnsPct
    };
  };

  return {
    schemeCode,
    schemeName: meta.scheme_name,
    fundHouse: meta.fund_house,
    schemeType: meta.scheme_type,
    schemeCategory: meta.scheme_category,
    latestNav,
    latestDate: latestNavObj.date,
    metrics: {
      return1M,
      return6M,
      return1Y,
      cagr3Y: isNaN(cagr3Y) ? return1Y : cagr3Y,
      cagr5Y: isNaN(cagr5Y) ? (isNaN(cagr3Y) ? return1Y : cagr3Y) : cagr5Y,
    },
    period,
    chartPoints: sampledPoints,
    historicalSIP: {
      sip1Y: calculateHistoricalSIPValue(2000, 1),
      sip3Y: calculateHistoricalSIPValue(2000, 3),
      sip5Y: calculateHistoricalSIPValue(2000, 5)
    }
  };
};

const searchLiveFunds = async (query = '') => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  try {
    const results = await fetchFromMFAPI(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query.trim())}`);
    return Array.isArray(results) ? results.slice(0, 15) : [];
  } catch (err) {
    console.error('Search live funds error:', err.message);
    return [];
  }
};

const getSIPs = async (userId) => {
  const sips = await SIP.find({ userId }).sort({ createdAt: -1 });

  let totalInvested = 0;
  let currentValue = 0;
  const categoryBreakdown = {};
  const cashflows = [];

  sips.forEach(sip => {
    totalInvested += sip.totalInvested || 0;
    currentValue += sip.currentValue || 0;

    const cat = sip.category || 'Other';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + (sip.currentValue || sip.totalInvested || 0);

    if (sip.totalInvested > 0 && sip.startDate) {
      const monthsActive = Math.max(1, Math.round((new Date() - new Date(sip.startDate)) / (1000 * 60 * 60 * 24 * 30)));
      const monthlyPmt = sip.amount;
      for (let m = 0; m < monthsActive; m++) {
        const d = new Date(sip.startDate);
        d.setMonth(d.getMonth() + m);
        cashflows.push({ amount: -monthlyPmt, date: d });
      }
    }
  });

  if (currentValue > 0) {
    cashflows.push({ amount: currentValue, date: new Date() });
  }

  const absoluteReturns = totalInvested > 0 ? Math.round(((currentValue - totalInvested) / totalInvested) * 10000) / 100 : 0;
  const portfolioXirr = cashflows.length > 2 ? calculateXIRR(cashflows) : 12.5;

  return {
    sips,
    summary: {
      totalInvested,
      currentValue,
      totalReturns: Math.round(currentValue - totalInvested),
      returnsPercentage: absoluteReturns,
      xirr: portfolioXirr || 12.0,
      activeCount: sips.filter(s => s.status === 'active').length,
      categoryBreakdown
    }
  };
};

const createSIP = async (userId, data) => {
  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const nextDate = new Date(startDate);
  nextDate.setMonth(nextDate.getMonth() + 1);

  const amount = Number(data.amount);
  const initialInvested = data.totalInvested ? Number(data.totalInvested) : amount;
  const growthRate = data.category === 'Small Cap' ? 0.16 : data.category === 'Mid Cap' ? 0.14 : 0.12;
  const initialCurrentValue = data.currentValue ? Number(data.currentValue) : Math.round(initialInvested * (1 + growthRate * 0.5));
  const returns = initialInvested > 0 ? Math.round(((initialCurrentValue - initialInvested) / initialInvested) * 10000) / 100 : 0;

  const sip = await SIP.create({
    userId,
    fundName: data.fundName.trim(),
    amc: data.amc.trim(),
    fundCode: data.fundCode || `FND_${Date.now()}`,
    category: data.category || 'Flexi Cap',
    amount,
    startDate,
    nextDate,
    frequency: data.frequency || 'monthly',
    status: 'active',
    totalInvested: initialInvested,
    currentValue: initialCurrentValue,
    returns,
    xirr: Math.round(growthRate * 10000) / 100
  });

  await SIPPerformance.create({
    sipId: sip._id,
    userId,
    nav: data.nav || 100,
    units: Math.round((initialInvested / (data.nav || 100)) * 1000) / 1000,
    totalInvested: initialInvested,
    currentValue: initialCurrentValue,
    date: new Date()
  });

  return sip;
};

const updateSIP = async (userId, sipId, data) => {
  const sip = await SIP.findOneAndUpdate({ _id: sipId, userId }, { ...data }, { new: true });
  if (!sip) {
    const err = new Error('SIP not found.');
    err.statusCode = 404;
    throw err;
  }
  return sip;
};

const deleteSIP = async (userId, sipId) => {
  const sip = await SIP.findOneAndDelete({ _id: sipId, userId });
  if (!sip) {
    const err = new Error('SIP not found.');
    err.statusCode = 404;
    throw err;
  }
  await SIPPerformance.deleteMany({ sipId });
  return { message: 'SIP and historical performance deleted successfully.' };
};

const getSIPPerformance = async (userId, sipId) => {
  const filter = { userId };
  if (sipId) filter.sipId = sipId;
  return await SIPPerformance.find(filter).sort({ date: 1 });
};

const getSIPRecommendations = async (userId, customSalary = null, customRisk = null) => {
  const user = await User.findById(userId);
  const salary = customSalary ? Number(customSalary) : (user ? user.monthlySalary : 30000);
  const risk = customRisk || (user ? user.riskProfile : 'moderate');

  const recommendations = await InvestmentRecommendation.find({
    salaryRangeMin: { $lte: salary },
    salaryRangeMax: { $gte: salary }
  }).sort({ priority: 1 });

  return {
    salary,
    riskProfile: risk,
    recommendations
  };
};

const calculateSIP = (body) => {
  const { monthlyAmount, annualRate = 12, tenureYears = 10 } = body;
  const result = calculateSIPFutureValue(Number(monthlyAmount), Number(annualRate), Number(tenureYears));

  const yearlyBreakdown = [];
  for (let year = 1; year <= Number(tenureYears); year++) {
    const pt = calculateSIPFutureValue(Number(monthlyAmount), Number(annualRate), year);
    yearlyBreakdown.push({
      year,
      invested: pt.totalInvested,
      wealthGained: pt.wealthGained,
      totalValue: pt.futureValue
    });
  }

  return {
    ...result,
    yearlyBreakdown
  };
};

const searchFunds = async (query = '') => {
  const filter = {};
  if (query) {
    filter.$or = [
      { fundName: { $regex: query, $options: 'i' } },
      { amc: { $regex: query, $options: 'i' } },
      { fundCategory: { $regex: query, $options: 'i' } }
    ];
  }
  return await InvestmentRecommendation.find(filter).limit(20);
};

module.exports = {
  getLiveFundNAV,
  searchLiveFunds,
  getSIPs,
  createSIP,
  updateSIP,
  deleteSIP,
  getSIPPerformance,
  getSIPRecommendations,
  calculateSIP,
  searchFunds
};
