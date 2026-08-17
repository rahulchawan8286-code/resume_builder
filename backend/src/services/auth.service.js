const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

class AuthService {
  generateTokens(user) {
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES
    });

    return { accessToken, refreshToken };
  }

  async registerUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      const err = new Error('Email already registered');
      err.statusCode = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const tokens = this.generateTokens(user);
    
    // Save refresh token to user
    await userRepository.updateById(user._id, { refreshToken: tokens.refreshToken });

    user.password = undefined; // Don't return password
    user.refreshToken = undefined; 

    return { user, tokens };
  }

  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const tokens = this.generateTokens(user);
    await userRepository.updateById(user._id, { refreshToken: tokens.refreshToken });

    user.password = undefined;
    user.refreshToken = undefined;

    return { user, tokens };
  }

  async logoutUser(userId) {
    await userRepository.updateById(userId, { refreshToken: null });
  }

  async refreshAuthToken(refreshToken) {
    if (!refreshToken) {
      const err = new Error('No refresh token provided');
      err.statusCode = 401;
      throw err;
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userRepository.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
         throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      await userRepository.updateById(user._id, { refreshToken: tokens.refreshToken });

      return tokens;
    } catch (err) {
      err.statusCode = 401;
      throw err;
    }
  }
}

module.exports = new AuthService();
