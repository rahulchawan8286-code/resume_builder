const sendEmail = require('../utils/sendEmail');

class EmailService {
  
  async sendVerificationEmail(email, name, token, origin) {
    const verifyUrl = `${origin}/verify-email?token=${token}`;
    
    const html = `
      <h1>Welcome to AI Resume Builder, ${name}!</h1>
      <p>Please confirm your email address by clicking the link below:</p>
      <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not create an account, no further action is required.</p>
    `;

    await sendEmail({
      email,
      subject: 'Verify your email address',
      html
    });
  }

  async sendPasswordResetEmail(email, name, token, origin) {
    const resetUrl = `${origin}/reset-password?token=${token}`;
    
    const html = `
      <h1>Password Reset Request</h1>
      <p>Hi ${name}, you are receiving this email because you (or someone else) has requested the reset of a password.</p>
      <p>Please make a PUT request to: \n\n <a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      email,
      subject: 'Password Reset Token',
      html
    });
  }

  async sendPasswordChangedEmail(email, name) {
    const html = `
      <h1>Password Changed</h1>
      <p>Hi ${name}, your password has been successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `;

    await sendEmail({
      email,
      subject: 'Your password was changed',
      html
    });
  }

  async sendWelcomeEmail(email, name) {
    const html = `
      <h1>Welcome Aboard, ${name}!</h1>
      <p>Your email has been verified. You can now log in and start building your AI-powered resume.</p>
    `;

    await sendEmail({
      email,
      subject: 'Email Verified - Welcome to AI Resume Builder',
      html
    });
  }
}

module.exports = new EmailService();
