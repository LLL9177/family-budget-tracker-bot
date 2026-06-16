import { InjectRepository } from '@nestjs/typeorm';
import { CreateTelegramRequestDto } from '../../dtos/CreateTelegramRequest.dto';
import { TelegramEntity } from '../entities/Telegram.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/User.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

interface ITelegramService {
  create(data: CreateTelegramRequestDto): Promise<void>;
  accept(id: string): Promise<void>;
  deny(id: string): Promise<void>;
}

export class TelegramService implements ITelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly repository: Repository<TelegramEntity>,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateTelegramRequestDto): Promise<void> {
    const user = await this.userService.findById(data.userId);
    if (!user) throw new NotFoundException('User not found');
    if (await this.repository.findOneBy({ telegramId: data.telegramId }))
      throw new BadRequestException(
        'Not allowed to create more than 1 request',
      );

    await this.repository.save({ ...data, user });
  }

  async accept(id: string): Promise<void> {
    const request = await this.repository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!request) throw new NotFoundException('Telegram request not found');
    if (await this.userService.findByTelegramId(request.telegramId))
      throw new BadRequestException(
        'Only one user can have a telegram account tied to his account.',
      );
    const user = request.user;
    if (!user) throw new NotFoundException('User not found');
    user.telegramId = request.telegramId;

    await this.userService.changeUser(user);
    await this.repository.delete(id);

    await fetch(process.env.BOT_URL + '/review_result', {
      method: 'POST',
      body: JSON.stringify({
        chat_id: request.chatId,
        lang: request.lang,
        result: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deny(id: string): Promise<void> {
    const request = await this.repository.findOneBy({ id });
    if (!request) throw new NotFoundException('Request not found');
    await this.repository.delete(request.id);
    await fetch(process.env.BOT_URL + '/review_result', {
      method: 'POST',
      body: JSON.stringify({
        chat_id: request.chatId,
        lang: request.lang,
        result: false,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  @Cron(CronExpression.EVERY_WEEK)
  private telegamReqTimeout() {
    const requests = this.repository.find({
      where: {},
    });
  }
}
