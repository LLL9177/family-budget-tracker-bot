import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from './entities/Telegram.entity';
import { TelegramService } from './services/Telegram.service';
import { UserModule } from '../user/user.module';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity]), UserModule],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
