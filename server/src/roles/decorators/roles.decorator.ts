import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/auth/enums/Roles.enum';

export const Role = (...roles: Roles[]) => SetMetadata('roles', roles);
