import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/enums/Roles.enum';
import { Role } from 'src/roles/decorators/roles.decorator';
import { OneTimePasswordService } from './services/OneTimePassword.service';

@Controller('one-time-password')
export class OneTimePasswordController {
  constructor(private readonly otpService: OneTimePasswordService) {}

  @Role(Roles.USER)
  @UseGuards(AuthGuard)
  @Get('renew')
  async renew(@Req() req: { user: { id: string } }) {
    return { otp: await this.otpService.renew(req.user.id) };
  }
}
