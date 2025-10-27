import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly isTestMode: boolean;

  constructor() {
    this.isTestMode = process.env.MAIL_HOST === 'localhost';

    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailData = {
      from: process.env.MAIL_FROM || `"EduCommerce" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    if (this.isTestMode) {
      this.logger.log('[TEST MODE] Email not sent.');
      this.logger.log(`To: ${to}`);
      this.logger.log(`Subject: ${subject}`);
      this.logger.log(`Text: ${text}`);
      if (html) this.logger.log(`HTML: ${html}`);
      return { success: true, message: 'Email logged (test mode)' };
    }

    try {
      const info = await this.transporter.sendMail(mailData);
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}


