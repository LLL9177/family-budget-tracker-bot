import { InjectRepository } from '@nestjs/typeorm';
import { CreateTelegramRequestDto } from '../../dtos/CreateTelegramRequest.dto';
import { TelegramEntity } from '../entities/Telegram.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/User.service';
import { NotFoundException } from '@nestjs/common';

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
    await this.repository.save({ ...data });
  }

  async accept(id: string): Promise<void> {
    const request = await this.repository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!request) throw new NotFoundException('Telegram request not found');

    await this.userService.changeUser({
      ...request.user,
      telegramId: request.telegramId,
    });

    await this.repository.delete(id);
  }

  async deny(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
