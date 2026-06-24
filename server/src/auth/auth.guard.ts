import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtTokenService } from '../jwt/Jwt.service';
import { RequestWithRefresh } from '../types/RequestWithRefresh.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithRefresh>();
    const res = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(req);
    const { refresh, isBot } = this.useRefresh(req);

    if (token && refresh) {
      try {
        const payload = this.jwtService.validateAccess(token);
        req['user'] = payload;
      } catch {
        if (!refresh) throw new UnauthorizedException('Log in again');
        const pair = await this.jwtService.refresh(refresh);
        res.setHeader('x-access-token', pair.access);
        const payload = this.jwtService.validateAccess(pair.access);
        req['user'] = payload;
      }
      return true;
    } else if (refresh) {
      this.jwtService.validateRefresh(refresh);

      const tokens = await this.jwtService.refresh(refresh);
      const payload = this.jwtService.validateAccess(tokens.access);

      res.setHeader('x-access-token', tokens.access);

      if (isBot) res.setHeader('x-refresh-token', tokens.refresh);
      else
        res.cookie('refresh', tokens.refresh, {
          httpOnly: true,
          secure: process.env.SECURE_CONNECTION == 'true',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 5,
        });

      req['user'] = payload;
      return true;
    }
    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private useRefresh(req: RequestWithRefresh): {
    refresh: string | undefined;
    isBot: boolean;
  } {
    const refresh = req.headers['x-refresh-token'] ?? req.cookies.refresh;
    const isBot = req.headers['x-refresh-token'] ? true : false;
    return { refresh, isBot };
  }
}
