import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation/zod-validation.pipe';
import { AuthService } from './auth.service';
import { EmailSchema, EmailSchemaType } from './schemas/zod/email.zod';
import { LoginSchema, LoginSchemaType } from './schemas/zod/login.zod';
import { RegisterSchema, RegisterSchemaType } from './schemas/zod/register.zod';
import {
  VerifyEmailSchema,
  VerifyEmailSchemaType,
} from './schemas/zod/verify-email.zod';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  registerUser(
    @Body(new ZodValidationPipe(RegisterSchema)) data: RegisterSchemaType,
  ) {
    return this.authService.register(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(
    @Body(new ZodValidationPipe(LoginSchema)) data: LoginSchemaType,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(data, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/verify-email')
  verifyEmail(
    @Body(new ZodValidationPipe(VerifyEmailSchema)) data: VerifyEmailSchemaType,
  ) {
    return this.authService.verifyEmail(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/resend-verification')
  resendVerificationEmail(
    @Body(new ZodValidationPipe(EmailSchema)) data: EmailSchemaType,
  ) {
    return this.authService.resendVerificationEmail(data.email);
  }
}
