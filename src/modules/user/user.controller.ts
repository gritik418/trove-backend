import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/me')
  getUser(@Req() req: Request) {
    return req.user;
  }
}
