import { Module } from '@nestjs/common';
import { OneTimePasswordService } from './services/OneTimePassword.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneTimePasswordEntity } from './entities/OneTimePassword.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CheckOTPExpirationsEvent } from './event-handlers/CheckOTPExpirations.handler';
import { ScheduleModule } from '@nestjs/schedule';
import { OneTimePasswordController } from './one-time-password.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { HashService } from 'src/auth/services/Hash.service';
import { JwtTokenService } from 'src/jwt/Jwt.service';

// circular dependency boiiiiz. I ain't fixing it
@Module({
  imports: [
    TypeOrmModule.forFeature([OneTimePasswordEntity]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
  ],
  providers: [
    OneTimePasswordService,
    CheckOTPExpirationsEvent,
    JwtService,
    HashService,
    JwtTokenService,
  ],
  controllers: [OneTimePasswordController],
  exports: [OneTimePasswordService],
})
export class OneTimePasswordModule {}
