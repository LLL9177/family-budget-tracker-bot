import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/enums/Roles.enum';
import { IJwtPayload } from 'src/types/IJwtPayload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const req: Request = context.switchToHttp().getRequest();
    const user = req['user'] as IJwtPayload;
    if (!user.roles) throw new ForbiddenException('Invalid role');

    return requiredRoles.some((role: Roles) => {
      return user.roles.includes(role);
    });
  }
}
