const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (email, code) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4f46e5; text-align: center;">Verify Your Account</h2>
      <p style="font-size: 16px; color: #374151;">Hello,</p>
      <p style="font-size: 16px; color: #374151;">Thank you for signing up! Use the following 6-digit verification code to complete your registration:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${code}</span>
      </div>
      <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't request this email, you can safely ignore it.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Verification Code - Auth System',
    html: htmlTemplate,
  });
};

module.exports = { sendVerificationEmail };
