const Company = require('../models/Company');
const CompanyBookmark = require('../models/CompanyBookmark');
const CompanyTarget = require('../models/CompanyTarget');
const { successResponse } = require('../utils/responseFormat');

exports.getAllCompanies = async (req, res, next) => {
  try {
    const { search, industry } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (industry) {
      query.industry = industry;
    }

    const companies = await Company.find(query).sort({ name: 1 });
    return successResponse(res, 200, 'Companies fetched successfully', companies);
  } catch (error) {
    next(error);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    return successResponse(res, 200, 'Company fetched successfully', company);
  } catch (error) {
    next(error);
  }
};

exports.bookmarkCompany = async (req, res, next) => {
  try {
    const { id: companyId } = req.params;
    const userId = req.user._id;

    const existing = await CompanyBookmark.findOne({ user: userId, company: companyId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Company already bookmarked' });
    }

    const bookmark = new CompanyBookmark({ user: userId, company: companyId });
    await bookmark.save();
    
    return successResponse(res, 201, 'Company bookmarked successfully', bookmark);
  } catch (error) {
    next(error);
  }
};

exports.removeBookmark = async (req, res, next) => {
  try {
    const { id: companyId } = req.params;
    const userId = req.user._id;

    await CompanyBookmark.findOneAndDelete({ user: userId, company: companyId });
    return successResponse(res, 200, 'Bookmark removed successfully', null);
  } catch (error) {
    next(error);
  }
};

exports.getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await CompanyBookmark.find({ user: req.user._id }).populate('company');
    return successResponse(res, 200, 'Bookmarks fetched', bookmarks);
  } catch (error) {
    next(error);
  }
};

exports.addTargetCompany = async (req, res, next) => {
  try {
    const { id: companyId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    let target = await CompanyTarget.findOne({ user: userId, company: companyId });
    
    if (target) {
      target.status = status || target.status;
      await target.save();
      return successResponse(res, 200, 'Target status updated', target);
    }

    target = new CompanyTarget({ user: userId, company: companyId, status: status || 'Interested' });
    await target.save();
    return successResponse(res, 201, 'Target company added', target);
  } catch (error) {
    next(error);
  }
};

exports.removeTargetCompany = async (req, res, next) => {
  try {
    const { id: companyId } = req.params;
    const userId = req.user._id;

    await CompanyTarget.findOneAndDelete({ user: userId, company: companyId });
    return successResponse(res, 200, 'Target company removed', null);
  } catch (error) {
    next(error);
  }
};

exports.getUserTargets = async (req, res, next) => {
  try {
    const targets = await CompanyTarget.find({ user: req.user._id }).populate('company');
    return successResponse(res, 200, 'Target companies fetched', targets);
  } catch (error) {
    next(error);
  }
};
