const nodemailer = require('nodemailer');
const logger = require('../logger/winston');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendWelcomeEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: '"Career Compass" <noreply@careercompass.com>',
      to,
      subject: 'Welcome to Career Compass',
      html: `<h1>Hello ${name}!</h1><p>Welcome to Career Compass API.</p>`
    });
  } catch (err) {
    logger.error('Error sending welcome email: ' + err.message);
  }
};

exports.sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: '"Career Compass" <noreply@careercompass.com>',
      to,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    });
  } catch (err) {
    logger.error('Error sending reset email: ' + err.message);
  }
};
