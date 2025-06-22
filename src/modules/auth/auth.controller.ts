import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation/zod-validation.pipe';
import { RegisterSchema, RegisterSchemaType } from './schemas/register.zod';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  registerUser(
    @Body(new ZodValidationPipe(RegisterSchema)) data: RegisterSchemaType,
  ) {
    return this.authService.register(data);
  }
}
