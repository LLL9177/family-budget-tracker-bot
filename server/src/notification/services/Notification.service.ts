import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { INotification } from '../../types/Notification.interface';
import { NotificationEntity } from '../entities/Notifitcation.entity';
import { UserService } from '../../user/User.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface INotificationService {
  create(data: INotification, userId: string): Promise<void>;
  findById(id: string): Promise<NotificationEntity | null>;
  delete(id: string, userId: string): Promise<void>;
  clear(userId: string): Promise<void>;
}

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(NotificationEntity)
    private repository: Repository<NotificationEntity>,
  ) {}

  async create(data: INotification, userId: string): Promise<void> {
    if (data.title.length > 80)
      throw new BadRequestException('Title is too big');
    if (data.body.length > 400)
      throw new BadRequestException('Body is too big');

    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const notification = await this.repository.save({ user, ...data });
    user.notifications.push(notification);
    await this.userService.changeUser(user);
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    // validate that the notification is tied to user
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const index = user.notifications.findIndex(
      (notification) => notification.id == id,
    );

    if (index == -1) throw new NotFoundException('Notification not found');

    await this.repository.delete(id);
  }

  async clear(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await Promise.all(
      user.notifications.map((n) => this.repository.delete(n.id)),
    );
  }
}
