import { Roles } from 'src/auth/enums/Roles.enum';

export interface IJwtPayload {
  id: string;
  roles: Roles[];
}
