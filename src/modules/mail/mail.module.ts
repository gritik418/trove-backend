import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ENV_KEYS } from 'src/common/constants/env.keys';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>(ENV_KEYS.SMTP_HOST),
          port: configService.get<string>(ENV_KEYS.SMTP_PORT),
          auth: {
            user: configService.get<string>(ENV_KEYS.SMTP_USER),
            pass: configService.get<string>(ENV_KEYS.SMTP_PASS),
          },
        },
        defaults: {
          from: '"Trove" <no-reply@trove.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
