const sipService = require('../services/sipService');

const getLiveFundNAV = async (req, res, next) => {
  try {
    const { schemeCode } = req.params;
    const { period = '1Y' } = req.query;
    const result = await sipService.getLiveFundNAV(schemeCode, period);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const searchLiveFunds = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await sipService.searchLiveFunds(q);
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

const getSIPs = async (req, res, next) => {
  try {
    const result = await sipService.getSIPs(req.user._id);
    res.status(200).json({
      success: true,
      data: result.sips,
      summary: result.summary
    });
  } catch (error) {
    next(error);
  }
};

const createSIP = async (req, res, next) => {
  try {
    const sip = await sipService.createSIP(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'SIP added to your portfolio',
      data: sip
    });
  } catch (error) {
    next(error);
  }
};

const updateSIP = async (req, res, next) => {
  try {
    const sip = await sipService.updateSIP(req.user._id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'SIP updated successfully',
      data: sip
    });
  } catch (error) {
    next(error);
  }
};

const deleteSIP = async (req, res, next) => {
  try {
    const result = await sipService.deleteSIP(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const salary = req.query.salary || null;
    const risk = req.query.risk || null;
    const result = await sipService.getSIPRecommendations(req.user._id, salary, risk);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getPerformance = async (req, res, next) => {
  try {
    const history = await sipService.getSIPPerformance(req.user._id, req.query.sipId);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

const calculate = async (req, res, next) => {
  try {
    const result = sipService.calculateSIP(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const searchFunds = async (req, res, next) => {
  try {
    const funds = await sipService.searchFunds(req.query.q);
    res.status(200).json({
      success: true,
      data: funds
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiveFundNAV,
  searchLiveFunds,
  getSIPs,
  createSIP,
  updateSIP,
  deleteSIP,
  getRecommendations,
  getPerformance,
  calculate,
  searchFunds
};
