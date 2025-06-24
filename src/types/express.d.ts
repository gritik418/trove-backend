import { JwtPayload } from 'src/common/types/jwt-payload.type';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}
