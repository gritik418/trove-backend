import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/common/enums/role.enum';

export function RoleGuard(requiredRoles: Role[]) {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user;

      if (!user || !user.sub) {
        throw new UnauthorizedException('User not authenticated.');
      }

      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          'You are not authorized to access this resource.',
        );
      }

      return true;
    }
  }

  return RoleGuardMixin;
}
