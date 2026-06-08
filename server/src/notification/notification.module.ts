import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { NotificationService } from './services/Notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/Notifitcation.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
