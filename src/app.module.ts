import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ENV_KEYS } from './common/constants/env.keys';
import { MailModule } from './modules/mail/mail.module';
import { JwtGlobalModule } from './common/jwt/jwt.module';
import { ProductModule } from './modules/product/product.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(ENV_KEYS.MONGO_URI),
        dbName: 'trove',
      }),
    }),
    UserModule,
    AuthModule,
    MailModule,
    JwtGlobalModule,
    ProductModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
