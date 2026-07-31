const authService = require('../services/authService');
const formatResponse = require('../utils/responseFormatter');

// Helper to set cookie headers
const setTokenCookies = (res, accessToken, refreshToken, rememberMe = false) => {
  const accessOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  const refreshOptions = {
    expires: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000), // 30 days or 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('accessToken', accessToken, accessOptions);
  res.cookie('refreshToken', refreshToken, refreshOptions);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth Debug] Cookies set. accessToken maxAge: 15m, refreshToken maxAge: ${rememberMe ? '30d' : '7d'}`);
  }
};

exports.register = async (req, res, next) => {
  try {
    const origin = req.headers.origin || 'http://localhost:5173';
    const { user } = await authService.register(req.body, origin);
    
    res.status(201).json(
      formatResponse(true, 'Registration successful. Please check your email to verify your account.', { user: { id: user._id, email: user.email, name: user.name } })
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    setTokenCookies(res, accessToken, refreshToken, rememberMe);

    res.status(200).json(
      formatResponse(true, 'Login successful', {
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto },
        accessToken // Sending in body as well for frontend clients that prefer memory storage over cookies
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (req.user && refreshToken) {
      await authService.logout(req.user.id, refreshToken);
    }

    res.cookie('accessToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });

    res.status(200).json(formatResponse(true, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Debug] Processing refresh token request');
    }
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log("Refresh cookie:", req.cookies.refreshToken);
    
    if (!incomingRefreshToken) {
      return res.status(401).json(formatResponse(false, 'Refresh token not found', null, [{ message: "Not authorized" }]));
    }

    const { user, accessToken, refreshToken } = await authService.refreshToken(incomingRefreshToken);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Auth Debug] Token verification result: User ${user._id} validated`);
    }

    setTokenCookies(res, accessToken, refreshToken);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Debug] Response sent: 200 OK Token refreshed');
    }
    res.status(200).json(formatResponse(true, 'Token refreshed', { accessToken }));
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const origin = req.headers.origin || 'http://localhost:5173';
    await authService.forgotPassword(req.body.email, origin);
    
    // Always return success to prevent email enumeration attacks
    res.status(200).json(formatResponse(true, 'If this email is registered, a reset link has been sent.'));
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json(formatResponse(true, 'Password successfully reset. Please log in.'));
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json(formatResponse(true, 'Email verified successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const userRepository = require('../repositories/userRepository');
    const user = await userRepository.findById(req.user.id);
    
    res.status(200).json(formatResponse(true, 'Current user data fetched', { user }));
  } catch (error) {
    next(error);
  }
};
