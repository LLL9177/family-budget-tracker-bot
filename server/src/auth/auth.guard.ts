import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtTokenService } from 'src/jwt/Jwt.service';

interface RequestWithCookies extends Request {
  cookies: {
    refresh?: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCookies>();
    const res = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(req);
    const refresh = req.cookies.refresh;

    if (!token || !refresh) throw new UnauthorizedException();

    if (token) {
      const payload = this.jwtService.validateAccess(token);
      req['user'] = payload;
      return true;
    } else if (refresh) {
      this.jwtService.validateRefresh(refresh);
      const tokens = await this.jwtService.refresh(refresh);
      const payload = this.jwtService.validateAccess(tokens.access);
      res.setHeader('x-access-token', tokens.access);
      res.cookie('refresh', tokens.refresh, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 5,
      });
      req['user'] = payload;
      return true;
    }
    return false;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
