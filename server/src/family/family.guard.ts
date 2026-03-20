import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/enums/Roles.enum';
import { JwtTokenService } from 'src/jwt/Jwt.service';

@Injectable()
export class FamilyGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    const payload = this.jwtService.validateAccess(token);
    if (!payload.roles.includes(Roles.FAMILY_OWNER))
      throw new ForbiddenException(
        'The user must be a family owner to access this feature',
      );

    return true;
  }
}
