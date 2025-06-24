import { Role } from 'src/modules/user/enums/role.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};
