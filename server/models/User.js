const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add a name'], trim: true, maxlength: [50] },
    email: { type: String, required: [true, 'Please add an email'], unique: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'] },
    password: { type: String, required: [true, 'Please add a password'], minlength: 8, select: false },
    role: { type: String, enum: ['student', 'admin', 'moderator'], default: 'student' },
    profilePhoto: { type: String, default: 'no-photo.jpg' },
    phone: { type: String, maxlength: [20] },
    college: { type: String, trim: true },
    branch: { type: String, trim: true },
    graduationYear: { type: Number },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    bio: { type: String, maxlength: [500] },
    resumeCount: { type: Number, default: 0 },
    
    // Auth & Security
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: { type: Date },
    refreshTokens: [{ type: String, select: false }], // For token rotation
    accountStatus: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Date },

    // Soft Delete Fields
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { 
      delete ret.password; 
      delete ret.refreshTokens; 
      delete ret.resetPasswordToken;
      delete ret.emailVerificationToken;
      return ret; 
    } },
    toObject: { virtuals: true }
  }
);

// --- Indexes ---
UserSchema.index({ role: 1, accountStatus: 1 });

// --- Virtuals ---
UserSchema.virtual('isGraduated').get(function() {
  if (!this.graduationYear) return null;
  return new Date().getFullYear() > this.graduationYear;
});
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// --- Pre-Save Hooks ---
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Pre-Find Hooks (Soft Delete Filter) ---
UserSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// --- Instance Methods ---
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  });
};

UserSchema.methods.getRefreshToken = function () {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  // Store it in the array
  this.refreshTokens.push(refreshToken);
  return refreshToken;
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate verification token
UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

// --- Static Methods ---
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password +loginAttempts +lockUntil +refreshTokens');
};

module.exports = mongoose.model('User', UserSchema);
