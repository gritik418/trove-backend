import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ENV_KEYS } from 'src/common/constants/env.keys';

@Injectable()
export class MailService {
  private supportEmail = 'support@trove.com';
  private clientUrl = process.env[ENV_KEYS.CLIENT_URL];

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, link: string) {
    this.mailerService.sendMail({
      to,
      subject: 'Your Trove Adventure Awaits — Verify to Begin 🛍️',
      template: 'verify-email',
      context: {
        link,
        clientUrl: this.clientUrl,
        supportEmail: this.supportEmail,
      },
    });
  }
}
