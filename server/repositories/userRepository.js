const User = require('../models/User');

class UserRepository {
  constructor() {
    this.memoryUsers = [];
    this.idCounter = 1;
  }

  _isDev() {
    return process.env.DEVELOPMENT_MODE === 'true';
  }

  async create(userData) {
    if (this._isDev()) {
      const crypto = require('crypto');
      const jwt = require('jsonwebtoken');
      
      const _id = `mock-user-${this.idCounter++}`;
      const user = { 
        ...userData, 
        _id,
        id: _id,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshTokens: [],
        role: userData.role || 'student',
        emailVerified: true,
        softDelete: async function() { this.isDeleted = true; this.deletedAt = new Date(); },
        matchPassword: async function(entered) { return entered === userData.password; }, // Very simple mock comparison
        getSignedJwtToken: function() { 
          return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' }); 
        },
        getRefreshToken: function() {
          const refreshToken = crypto.randomBytes(40).toString('hex');
          this.refreshTokens.push(refreshToken);
          return refreshToken;
        },
        getResetPasswordToken: function() {
          const resetToken = crypto.randomBytes(20).toString('hex');
          this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
          this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
          return resetToken;
        },
        getEmailVerificationToken: function() {
          const verificationToken = crypto.randomBytes(20).toString('hex');
          this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
          this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
          return verificationToken;
        },
        save: async function() { this.updatedAt = new Date(); return this; }
      };
      
      this.memoryUsers.push(user);
      return user;
    }
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email, includeSensitive = false) {
    if (this._isDev()) {
      const user = this.memoryUsers.find(u => u.email === email && !u.isDeleted);
      return user || null;
    }
    if (includeSensitive) {
      return await User.findByEmail(email);
    }
    return await User.findOne({ email });
  }

  async findById(id, includeSensitive = false) {
    if (this._isDev()) {
      const user = this.memoryUsers.find(u => u._id === id && !u.isDeleted);
      return user || null;
    }
    if (includeSensitive) {
      return await User.findById(id).select('+password +refreshTokens +loginAttempts +lockUntil');
    }
    return await User.findById(id);
  }

  async findByVerificationToken(hashedToken) {
    if (this._isDev()) {
      return this.memoryUsers.find(u => u.emailVerificationToken === hashedToken && u.emailVerificationExpire > Date.now());
    }
    return await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    });
  }

  async findByResetToken(hashedToken) {
    if (this._isDev()) {
      return this.memoryUsers.find(u => u.resetPasswordToken === hashedToken && u.resetPasswordExpire > Date.now());
    }
    return await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');
  }

  async update(user, updateData) {
    if (this._isDev()) {
      Object.assign(user, updateData, { updatedAt: new Date() });
      return user;
    }
    Object.assign(user, updateData);
    return await user.save();
  }

  async incrementLoginAttempts(user) {
    if (user.lockUntil && user.lockUntil < Date.now()) {
      return await this.update(user, { loginAttempts: 1, lockUntil: undefined });
    }
    const updates = { loginAttempts: (user.loginAttempts || 0) + 1 };
    if (updates.loginAttempts >= 5) {
      updates.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    return await this.update(user, updates);
  }

  async resetLoginAttempts(user) {
    return await this.update(user, { loginAttempts: 0, lockUntil: undefined });
  }

  async softDelete(user) {
    if (this._isDev()) {
      if (typeof user.softDelete === 'function') {
        await user.softDelete();
      } else {
        user.isDeleted = true;
        user.deletedAt = new Date();
      }
      return user;
    }
    return await user.softDelete();
  }
}

module.exports = new UserRepository();
