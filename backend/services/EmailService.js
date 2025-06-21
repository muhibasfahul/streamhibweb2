const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"StreamHib" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });

      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }
}

const emailService = new EmailService();

module.exports = {
  sendEmail: emailService.sendEmail.bind(emailService)
};