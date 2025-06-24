import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME } from 'src/common/constants/cookie-options';
import { JwtPayload } from 'src/common/types/jwt-payload.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authToken = request.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!authToken)
      throw new UnauthorizedException('Please log in to continue.');

    try {
      const payload = this.jwtService.verify<JwtPayload>(authToken);
      if (!payload || !payload.sub)
        throw new UnauthorizedException('Please log in to continue.');

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Please log in to continue.');
    }
  }
}
