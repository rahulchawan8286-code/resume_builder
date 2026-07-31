const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
  if (process.env.DEVELOPMENT_MODE === 'true') {
    logger.info(`Mock email sent to ${options.email} with subject: ${options.subject}`);
    return;
  }

  // If no SMTP credentials are provided, log a warning and skip silently.
  // This prevents a crash when running locally without a mail server configured.
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    logger.warn(`Email skipped (no SMTP credentials): To: ${options.email} | Subject: ${options.subject}`);
    return;
  }

  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'AI Resume Builder'} <${process.env.FROM_EMAIL || 'noreply@resume.test'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(message);
    logger.info(`Email sent to ${options.email} - Message ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Error sending email to ${options.email}: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
