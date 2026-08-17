const authService = require('../services/auth.service');
const { successResponse } = require('../utils/responseFormat');

const setTokenCookies = (res, tokens) => {
  const isProd = process.env.NODE_ENV === 'production';
  const refreshExpiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES) || 7; // days
  
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'Lax',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'Lax',
    maxAge: refreshExpiresIn * 24 * 60 * 60 * 1000
  });
};

exports.register = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.registerUser(req.body);
    setTokenCookies(res, tokens);
    return successResponse(res, 201, 'User registered successfully', { user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.loginUser(email, password);
    setTokenCookies(res, tokens);
    return successResponse(res, 200, 'Login successful', { user });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await authService.logoutUser(req.user._id);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const tokens = await authService.refreshAuthToken(refreshToken);
    setTokenCookies(res, tokens);
    return successResponse(res, 200, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached to req by authenticate middleware
    return successResponse(res, 200, 'Current user retrieved', { user: req.user });
  } catch (error) {
    next(error);
  }
};
