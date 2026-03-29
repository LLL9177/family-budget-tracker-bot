import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from './services/Auth.service';
import { LoginDto } from 'src/dtos/login.dto';
import { AuthGuard } from './auth.guard';
import { Role } from 'src/roles/decorators/roles.decorator';
import { Roles } from './enums/Roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { BotGuard } from 'src/bot/bot.guard';
import { BotLoginDto } from 'src/dtos/BotLogin.dto';
import { GoogleAuthDto } from 'src/dtos/GoogleAuth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) body: UserDto) {
    return await this.authService.register(body);
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('profile')
  getProfile(@Req() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('google_auth')
  async googleAuth(@Body(new ValidationPipe()) body: GoogleAuthDto) {
    return await this.authService.googleAuth(body);
  }

  @UseGuards(BotGuard)
  @Post('bot/login')
  async botLogin(@Body(new ValidationPipe()) body: BotLoginDto) {
    return await this.authService.botLogin(body);
  }

  @UseGuards(BotGuard)
  @Get('bot/get_username')
  async botGetUsername(@Query('id') id: string) {
    return await this.authService.botGetUsername(id);
  }
}
