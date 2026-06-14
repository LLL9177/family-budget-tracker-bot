import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './User.service';
import { GetUserDto } from '../dtos/getUser.dto';
import { setTelegramDto } from '../dtos/SetTelegram.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: string } },
  ) {
    await this.userService.setAvatar(file, req.user.id);
  }

  @Get()
  async getUser(@Query(new ValidationPipe()) dto: GetUserDto) {
    return await this.userService.findById(dto.id);
  }

  @Post('set-telegram')
  @UseGuards(AuthGuard)
  async setTelegram(
    @Body(new ValidationPipe()) dto: setTelegramDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.userService.setTelegram({
      telegramId: dto.telegramId,
      userId: req.user.id,
    });
  }
}
