import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateCategoryDto } from 'src/dtos/UpdateCategory.dto';
import { DeleteCategoryDto } from 'src/dtos/DeleteCategory.dto';
import { CreateCategoryDto } from 'src/dtos/CreateCategory.dto';
import { CategoryService } from './services/Category.service';
import { BotGuard } from 'src/bot/bot.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { FamilyGuard } from 'src/family/family.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(BotGuard)
  @Post('create')
  async create(@Body(new ValidationPipe()) dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @UseGuards(BotGuard)
  @Get('get')
  async get(@Param('userTelegramId') userTelegramId: bigint) {
    return await this.categoryService.findByUserTg(userTelegramId);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Get('get/by_user')
  async getByUser(@Req() req: { user: { id: string } }) {
    return await this.categoryService.findByUserId(req.user.id);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Patch('update')
  async update(@Body(new ValidationPipe()) dto: UpdateCategoryDto) {
    return await this.categoryService.update(dto);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('delete')
  async delete(
    @Body(new ValidationPipe()) dto: DeleteCategoryDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.categoryService.delete(dto.id, req.user.id);
  }
}
