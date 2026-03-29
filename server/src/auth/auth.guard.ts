import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtTokenService } from 'src/jwt/Jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const authTokens = this.extractTokenFromHeader(req);

    if (!authTokens) throw new UnauthorizedException();

    const token = typeof authTokens == 'string' ? authTokens : authTokens.token;
    const refresh =
      typeof authTokens == 'string' ? undefined : authTokens.refresh;

    if (token) {
      const payload = this.jwtService.validateAccess(token);
      res.setHeader('x-access-token', token);
      req['user'] = payload;
      return true;
    } else if (refresh) {
      this.jwtService.validateRefresh(refresh);
      const tokens = await this.jwtService.refresh(refresh);
      const payload = this.jwtService.validateAccess(tokens.access);
      res.setHeader('x-access-token', tokens.access);
      res.setHeader('x-refresh-token', tokens.refresh);
      req['user'] = payload;
      return true;
    }

    return false;
  }

  private extractTokenFromHeader(
    req: Request,
  ): { token: string; refresh: string } | string | undefined {
    const tokens = req.headers.authorization?.split(' ') ?? [];
    if (tokens.length == 3) {
      const [type, token, refresh] = tokens;
      return type === 'Bearer' ? { token, refresh } : undefined;
    } else if (tokens.length == 2) {
      const [type, token] = tokens;
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
