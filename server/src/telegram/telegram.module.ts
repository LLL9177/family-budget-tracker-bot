import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from './entities/Telegram.entity';
import { TelegramService } from './services/Telegram.service';
import { UserModule } from '../user/user.module';
import { TelegramController } from './telegram.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramEntity]),
    UserModule,
    forwardRef(() => AuthModule),
    NotificationModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
