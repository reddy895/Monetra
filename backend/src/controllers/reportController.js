const reportService = require('../services/reportService');

const getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const report = await reportService.getMonthlyReport(req.user._id, month, year);
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const getYearlyReport = async (req, res, next) => {
  try {
    const { year } = req.query;
    const report = await reportService.getYearlyReport(req.user._id, year);
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const exportPDFData = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const report = await reportService.getMonthlyReport(req.user._id, month, year);
    res.status(200).json({
      success: true,
      data: {
        title: `Monthly Financial Health Report - ${report.month}/${report.year}`,
        generatedAt: new Date().toISOString(),
        ...report
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlyReport,
  getYearlyReport,
  exportPDFData
};
