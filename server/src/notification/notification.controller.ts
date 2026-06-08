import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { NotificationService } from './services/Notification.service';
import { DeleteNotificationDto } from '../dtos/DeleteNotification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('delete')
  async deleteNotification(
    @Body(new ValidationPipe()) dto: DeleteNotificationDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.notificationService.delete(dto.id, req.user.id);
  }

  @Post('clear')
  async clearNotifications(@Req() req: { user: { id: string } }) {
    await this.notificationService.clear(req.user.id);
  }
}
