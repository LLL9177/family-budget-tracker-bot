import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
  Query
} from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from './services/Auth.service';
import { LoginDto } from 'src/dtos/login.dto';
import { AuthGuard } from './auth.guard';
import { Role } from 'src/roles/decorators/roles.decorator';
import { Roles } from './enums/Roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { BotLoginDto } from 'src/dtos/BotLogin.dto';
import { GoogleAuthDto } from 'src/dtos/GoogleAuth.dto';
import type { Response } from 'express';
import { BotGuard } from '../bot/bot.guard';
import { BotGoogleLoginDto } from '../dtos/BotGoogleLogin.dto';
import { BotProfileDto } from 'src/dtos/BotProfile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe()) body: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);

    if (result) {
      res.cookie('refresh', result.access_token.refresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 5,
      });
    }

    return result;
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@Req() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    if (result) {
      res.cookie('refresh', result.access_token.refresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 5,
      });
    }

    return result;
  }

  @Post('google_auth')
  async googleAuth(
    @Body(new ValidationPipe()) body: GoogleAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.googleAuth(body);

    if (result) {
      res.cookie('refresh', result.access_token.refresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 5,
      });
    }

    return result;
  }

  @UseGuards(BotGuard)
  @Post('bot/login')
  async botLogin(@Body(new ValidationPipe()) body: BotLoginDto) {
    return await this.authService.botLogin(body);
  }

  @UseGuards(BotGuard)
  @Post('bot/google')
  async botGoogleAuth(@Body(new ValidationPipe()) body: BotGoogleLoginDto) {
    return await this.authService.botGoogleAuth(body);
  }

  @UseGuards(AuthGuard)
  @Get('/renew-access')
  renewAccess() {
    return null; // since auth guard does that already
  }

  @UseGuards(BotGuard)
  @Get('/bot/profile')
  async botProfile(@Query() dto: BotProfileDto) {
    return await this.authService.botGetProfile(dto.telegram_id)
  }
}
