/**
 * Date utility helpers
 */

const getMonthDateRange = (month, year) => {
  // month: 1-12
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return { startDate, endDate };
};

const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

module.exports = {
  getMonthDateRange,
  getCurrentMonthYear,
  getDaysInMonth
};
