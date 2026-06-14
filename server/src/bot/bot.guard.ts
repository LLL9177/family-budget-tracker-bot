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
    const botToken = req.headers['x-bot-token'];

    if (!botToken || botToken != process.env.BOT_TOKEN)
      throw new UnauthorizedException('Invalid or no bot token');

    return true;
  }
}
