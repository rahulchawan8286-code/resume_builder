const ErrorResponse = require('../utils/errorResponse');
const userRepository = require('../repositories/userRepository');
const emailService = require('./emailService');
const crypto = require('crypto');
const logger = require('../utils/logger');

class AuthService {
  async register(userData, origin) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ErrorResponse('Email is already registered', 400);
    }

    const user = await userRepository.create(userData);
    
    // Generate verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken, origin);
    
    logger.info(`New user registered: ${user.email}`);
    
    return { user };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email, true);
    
    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    if (user.isLocked) {
      throw new ErrorResponse('Account is locked. Please try again later or reset password.', 423);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await userRepository.incrementLoginAttempts(user);
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new ErrorResponse('Invalid credentials', 401);
    }

    if (!user.emailVerified) {
      // Only enforce email verification when an SMTP server is configured
      // This prevents users from being locked out in local dev without a mail server
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        throw new ErrorResponse('Please verify your email address to log in', 403);
      }
      // In dev (no SMTP), auto-verify so login works
      user.emailVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    // Reset login attempts on successful login
    await userRepository.resetLoginAttempts(user);
    user.lastLogin = Date.now();

    // Generate tokens
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();
    
    await user.save({ validateBeforeSave: false });
    
    logger.info(`User logged in: ${user.email}`);

    return { user, accessToken, refreshToken };
  }

  async logout(userId, refreshToken) {
    const user = await userRepository.findById(userId, true);
    if (user && refreshToken) {
      // Remove the specific refresh token from array
      user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
      await user.save({ validateBeforeSave: false });
      logger.info(`User logged out: ${user.email}`);
    }
  }

  async refreshToken(token) {
    let foundUser;
    if (process.env.DEVELOPMENT_MODE === 'true') {
      foundUser = userRepository.memoryUsers.find(u => u.refreshTokens && u.refreshTokens.includes(token));
    } else {
      const User = require('../models/User');
      foundUser = await User.findOne({ refreshTokens: token }).select('+refreshTokens');
    }

    if (!foundUser) {
      throw new ErrorResponse('Invalid refresh token', 401);
    }

    // Token Rotation: Remove old, add new
    foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt !== token);

    const newAccessToken = foundUser.getSignedJwtToken();
    const newRefreshToken = foundUser.getRefreshToken();

    await foundUser.save({ validateBeforeSave: false });

    return { user: foundUser, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(email, origin) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Do not reveal if user exists or not for security
      return true; 
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendPasswordResetEmail(user.email, user.name, resetToken, origin);
      logger.info(`Password reset requested for: ${user.email}`);
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ErrorResponse('Email could not be sent', 500);
    }
  }

  async resetPassword(resetToken, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await userRepository.findByResetToken(hashedToken);
    
    if (!user) {
      throw new ErrorResponse('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // Clear all refresh tokens to force login everywhere
    user.refreshTokens = [];
    // Unlock account if it was locked
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    
    await user.save();
    await emailService.sendPasswordChangedEmail(user.email, user.name);
    logger.info(`Password reset successful for: ${user.email}`);
    
    return true;
  }

  async verifyEmail(verificationToken) {
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const user = await userRepository.findByVerificationToken(hashedToken);

    if (!user) {
      throw new ErrorResponse('Invalid or expired verification token', 400);
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    await emailService.sendWelcomeEmail(user.email, user.name);
    logger.info(`Email verified for: ${user.email}`);
    
    return true;
  }
}

module.exports = new AuthService();
