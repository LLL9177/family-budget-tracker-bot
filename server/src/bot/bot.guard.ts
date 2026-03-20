import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class BotGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const body = req.body as { botToken: string };

    if (!body.botToken || body.botToken != process.env.BOT_TOKEN)
      throw new UnauthorizedException('Invalid or no bot token');

    return true;
  }
}
