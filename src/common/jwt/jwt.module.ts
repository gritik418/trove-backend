import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ENV_KEYS } from '../constants/env.keys';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_KEYS.JWT_SECRET),
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
