import { OnEvent } from '@nestjs/event-emitter';
import { OneTimePasswordService } from '../services/OneTimePassword.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckOTPExpirationsEvent {
  constructor(private readonly otpService: OneTimePasswordService) {}

  @OnEvent('otp-expirations.check-expirations')
  async handleStartOtpCron(payload: {}) {
    await this.otpService.checkAllPasswords();
  }
}
