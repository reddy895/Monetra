/**
 * Financial calculation algorithms: XIRR and CAGR
 */

// Newton-Raphson implementation for XIRR
const calculateXIRR = (cashflows) => {
  // cashflows: [{ amount: -500, date: new Date(...) }, ..., { amount: 6200, date: new Date(...) }]
  if (!cashflows || cashflows.length < 2) return 0;

  const firstDate = cashflows[0].date.getTime();
  const maxIterations = 100;
  const tolerance = 1e-6;
  let rate = 0.1; // initial guess 10%

  for (let i = 0; i < maxIterations; i++) {
    let fValue = 0;
    let fDerivative = 0;

    for (const cf of cashflows) {
      const days = (cf.date.getTime() - firstDate) / (1000 * 60 * 60 * 24);
      const fractionOfYear = days / 365.0;
      const denom = Math.pow(1 + rate, fractionOfYear);

      if (denom === 0) continue;
      fValue += cf.amount / denom;
      fDerivative -= (fractionOfYear * cf.amount) / (denom * (1 + rate));
    }

    if (Math.abs(fDerivative) < 1e-10) break;
    const newRate = rate - fValue / fDerivative;

    if (Math.abs(newRate - rate) <= tolerance) {
      return Math.round(newRate * 10000) / 100; // Return as percentage, e.g. 14.52%
    }

    rate = newRate;
  }

  return Math.round(rate * 10000) / 100;
};

// SIP Future Value formula
const calculateSIPFutureValue = (monthlyAmount, annualRatePercentage, tenureYears) => {
  const i = (annualRatePercentage / 100) / 12;
  const n = tenureYears * 12;
  // FV = P * [((1 + i)^n - 1) / i] * (1 + i)
  const futureValue = monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalInvested = monthlyAmount * n;
  const wealthGained = futureValue - totalInvested;

  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(wealthGained),
    tenureYears,
    annualRatePercentage
  };
};

module.exports = {
  calculateXIRR,
  calculateSIPFutureValue
};
