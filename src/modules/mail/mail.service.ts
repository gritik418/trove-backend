import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ENV_KEYS } from 'src/common/constants/env.keys';

@Injectable()
export class MailService {
  private supportEmail = process.env[ENV_KEYS.SUPPORT_EMAIL];
  private clientUrl = process.env[ENV_KEYS.CLIENT_URL];

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, link: string, subject: string) {
    this.mailerService.sendMail({
      to,
      subject,
      template: 'verify-email',
      context: {
        link,
        clientUrl: this.clientUrl,
        supportEmail: this.supportEmail,
      },
    });
  }

  async sendVerificationSuccessEmail(to: string, fullName: string) {
    this.mailerService.sendMail({
      to,
      subject: "You're In! Welcome to Trove 🛍️",
      template: 'verify-success',
      context: {
        fullName,
        clientUrl: this.clientUrl,
        supportEmail: this.supportEmail,
      },
    });
  }
}
