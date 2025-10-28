import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    });
  }

  private async sendMail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || `"EduCommerce" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent successfully to ${to} - ${subject}`);
      this.logger.debug(`Gmail response: ${info.response}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw new Error('Email sending failed');
    }
  }

  async sendAdminInvitationEmail(
    email: string,
    payload: { name: string; tempPassword: string; inviterName: string },
  ) {
    const subject = 'You have been invited as an Admin on EduCommerce';
    const message = `
Hi ${payload.name},

You have been invited by ${payload.inviterName} to join EduCommerce as an admin.

Here are your temporary login details:

Email: ${email}
Temporary Password: ${payload.tempPassword}

Please log in using this password and update it immediately after your first login:
${process.env.ADMIN_PORTAL_URL || 'https://educommerce-admin.com/login'}

Thank you,
EduCommerce Team
`;
    await this.sendMail(email, subject, message);
  }

  async sendPasswordResetOtp(email: string, otp: string) {
    const subject = 'EduCommerce Password Reset OTP';
    const message = `
Hi there,

You requested to reset your password.

Your OTP is: ${otp}

This OTP will expire in 5 minutes. If you didn’t request a password reset, please ignore this message.

Thank you,
EduCommerce Security Team
`;
    await this.sendMail(email, subject, message);
  }
}



  




