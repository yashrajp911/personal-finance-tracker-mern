// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER, // Email from which you want to send
      pass: process.env.EMAIL_PASS, // Password for that email account
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to, // Receiver's email
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
