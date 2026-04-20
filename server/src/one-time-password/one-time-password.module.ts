import { Module } from '@nestjs/common';
import { OneTimePasswordService } from './services/OneTimePassword.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneTimePasswordEntity } from './entities/OneTimePassword.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CheckOTPExpirationsEvent } from './event-handlers/CheckOTPExpirations.handler';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([OneTimePasswordEntity]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [OneTimePasswordService, CheckOTPExpirationsEvent],
  exports: [OneTimePasswordService],
})
export class OneTimePasswordModule {}
