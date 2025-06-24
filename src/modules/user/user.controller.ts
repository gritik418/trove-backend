import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard, RoleGuard([Role.ADMIN, Role.CUSTOMER]))
  @Get('/me')
  getUser(@Req() req: Request) {
    return req.user;
  }
}
