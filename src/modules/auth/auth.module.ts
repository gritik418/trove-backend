import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtGlobalModule } from 'src/common/jwt/jwt.module';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
    JwtGlobalModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
