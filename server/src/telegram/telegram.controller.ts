import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TelegramService } from './services/Telegram.service';
import { AcceptDenyTelegramRequestDto } from '../dtos/AcceptDenyTelegramRequest.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @UseGuards(AuthGuard)
  @Post('accept')
  async accept(@Body(new ValidationPipe()) dto: AcceptDenyTelegramRequestDto) {
    await this.telegramService.accept(dto.id);
  }

  @UseGuards(AuthGuard)
  @Post('deny')
  async deny(@Body(new ValidationPipe()) dto: AcceptDenyTelegramRequestDto) {
    await this.telegramService.deny(dto.id);
  }
}
