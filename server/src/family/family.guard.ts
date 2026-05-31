import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/enums/Roles.enum';
import { RequestWithRefresh } from '../types/RequestWithRefresh.interface';
import { JwtTokenService } from '../jwt/Jwt.service';

@Injectable()
export class FamilyGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: RequestWithRefresh = context.switchToHttp().getRequest();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    const refresh = req.cookies.refresh ?? '';

    try {
      const payload = this.jwtService.validateAccess(token);

      if (!payload.roles.includes(Roles.FAMILY_OWNER)) {
        throw new ForbiddenException(
          'The user must be a family owner to access this feature',
        );
      }
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        try {
          const payload = this.jwtService.validateRefresh(refresh);

          // refresh is valid
          return true; // or whatever your guard should do
        } catch {
          throw new UnauthorizedException('Please log in again.');
        }
      }

      throw error;
    }

    return true;
  }
}
