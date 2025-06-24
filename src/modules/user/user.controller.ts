import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@Controller('user')
export class UserController {
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/me')
  getUser(@Req() req: Request) {
    return req.user;
  }
}
