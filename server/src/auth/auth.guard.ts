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
    const body = req.body as { refresh: string };
    const refresh = body.refresh;
    const token = this.extractTokenFromHeader(req);

    if (!token || !refresh) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.validateAccess(token);
      res.setHeader('x-access-token', token);
      res.setHeader('x-refresh-token', refresh);
      req['user'] = payload;
    } catch {
      try {
        this.jwtService.validateRefresh(refresh);
        const tokens = await this.jwtService.refresh(refresh);
        const payload = this.jwtService.validateAccess(tokens.access);
        res.setHeader('x-access-token', tokens.access);
        res.setHeader('x-refresh-token', tokens.refresh);
        req['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
