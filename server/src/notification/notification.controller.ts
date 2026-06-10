import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './services/Notification.service';
import { DeleteNotificationDto } from '../dtos/DeleteNotification.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('delete')
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Body(new ValidationPipe()) dto: DeleteNotificationDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.notificationService.delete(dto.id, req.user.id);
  }

  @Post('clear')
  @UseGuards(AuthGuard)
  async clearNotifications(@Req() req: { user: { id: string } }) {
    await this.notificationService.clear(req.user.id);
  }
}
