const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const logger = require('../../helpers/logger.js');

const toBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return String(value).toLowerCase() === 'true';
};

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const EMAIL_ENABLED_DEFAULT = process.env.NODE_ENV !== 'test';

const isEmailEnabled = () =>
  toBoolean(process.env.EMAIL_ENABLED, EMAIL_ENABLED_DEFAULT);

const getSesConfig = () => {
  const config = {
    region: process.env.AWS_REGION
  };

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };

    if (process.env.AWS_SESSION_TOKEN) {
      config.credentials.sessionToken = process.env.AWS_SESSION_TOKEN;
    }
  }

  return config;
};

const getFromAddress = () => {
  if (process.env.EMAIL_FROM) {
    return process.env.EMAIL_FROM;
  }

  const senderEmail = process.env.SES_SENDER_EMAIL;
  const senderName = process.env.SES_SENDER_NAME;

  if (!senderEmail) {
    return '';
  }

  return senderName ? `${senderName} <${senderEmail}>` : senderEmail;
};

const redactEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return 'unknown-email';
  }

  const [localPart, domain] = email.split('@');
  const visible = localPart.slice(0, 2);
  return `${visible}***@${domain}`;
};

const validateEmailConfig = () => {
  if (!isEmailEnabled()) {
    return;
  }

  const missing = [];

  if (!process.env.AWS_REGION) {
    missing.push('AWS_REGION');
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    missing.push('AWS_ACCESS_KEY_ID');
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    missing.push('AWS_SECRET_ACCESS_KEY');
  }

  if (!getFromAddress()) {
    missing.push('SES_SENDER_EMAIL or EMAIL_FROM');
  }

  if (missing.length > 0) {
    throw createError(
      `Email service is misconfigured. Missing: ${missing.join(', ')}`,
      500
    );
  }
};

if (process.env.NODE_ENV === 'production' && isEmailEnabled()) {
  validateEmailConfig();
}

let sesClient;

const getSesClient = () => {
  if (!sesClient) {
    validateEmailConfig();
    sesClient = new SESv2Client(getSesConfig());
  }

  return sesClient;
};

const buildSesBody = ({ text, html }) => {
  if (!text && !html) {
    throw createError('Email body must include text or html', 400);
  }

  const body = {};

  if (text) {
    body.Text = {
      Data: text,
      Charset: 'UTF-8'
    };
  }

  if (html) {
    body.Html = {
      Data: html,
      Charset: 'UTF-8'
    };
  }

  return body;
};

const sendEmail = async ({ to, subject, text, html, context }) => {
  if (!isEmailEnabled()) {
    logger.warn('Email sending disabled. Skipping %s email for %s', context, redactEmail(to));
    return { skipped: true };
  }

  try {
    const command = new SendEmailCommand({
      FromEmailAddress: getFromAddress(),
      Destination: {
        ToAddresses: [to]
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: buildSesBody({ text, html })
        }
      }
    });

    const info = await getSesClient().send(command);

    logger.info('Email sent for %s to %s with id %s', context, redactEmail(to), info.MessageId || 'n/a');
    return {
      messageId: info.MessageId || null
    };
  } catch (error) {
    logger.error('Email send failed for %s to %s: %s', context, redactEmail(to), error.message);
    throw createError(error.message, error.status || 503);
  }
};

const sendEmailVerificationOtp = async ({ email, firstName, otp, ttlMinutes }) => {
  const greetingName = firstName || 'Traveler';
  const subject = 'TravelBuddy verification code';
  const text = [
    `Hi ${greetingName},`,
    '',
    `Your TravelBuddy verification code is: ${otp}`,
    `This code expires in ${ttlMinutes} minutes.`,
    '',
    'If you did not create this account, please ignore this message.'
  ].join('\n');

  const html = [
    `<p>Hi ${greetingName},</p>`,
    `<p>Your TravelBuddy verification code is:</p>`,
    `<p style="font-size: 24px; font-weight: 700; letter-spacing: 2px;">${otp}</p>`,
    `<p>This code expires in <strong>${ttlMinutes} minutes</strong>.</p>`,
    '<p>If you did not create this account, please ignore this message.</p>'
  ].join('');

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    context: 'email-verification-otp'
  });
};

const sendPasswordResetOtp = async ({ email, firstName, otp, ttlMinutes }) => {
  const greetingName = firstName || 'Traveler';
  const subject = 'TravelBuddy password reset code';
  const text = [
    `Hi ${greetingName},`,
    '',
    `Your password reset code is: ${otp}`,
    `This code expires in ${ttlMinutes} minutes.`,
    '',
    'If you did not request a password reset, please secure your account.'
  ].join('\n');

  const html = [
    `<p>Hi ${greetingName},</p>`,
    '<p>You requested a password reset for your TravelBuddy account.</p>',
    `<p>Your reset code is:</p>`,
    `<p style="font-size: 24px; font-weight: 700; letter-spacing: 2px;">${otp}</p>`,
    `<p>This code expires in <strong>${ttlMinutes} minutes</strong>.</p>`,
    '<p>If you did not request this, please secure your account immediately.</p>'
  ].join('');

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    context: 'password-reset-otp'
  });
};

module.exports = {
  sendEmail,
  sendEmailVerificationOtp,
  sendPasswordResetOtp
};
