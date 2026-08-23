import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UpdateCategoryDto } from 'src/dtos/UpdateCategory.dto';
import { DeleteCategoryDto } from 'src/dtos/DeleteCategory.dto';
import { CreateCategoryDto } from 'src/dtos/CreateCategory.dto';
import { CategoryService } from './services/Category.service';
import { BotGuard } from 'src/bot/bot.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(BotGuard)
  @Post('create')
  async create(@Body(new ValidationPipe()) dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @UseGuards(BotGuard)
  @Get("get")
  async get(@Param("userTelegramId") userTelegramId: bigint) {
    return await this.categoryService.findByUserTg(userTelegramId);
  }

  @UseGuards(BotGuard)
  @Post('update')
  async update(@Body(new ValidationPipe()) dto: UpdateCategoryDto) {
    await this.categoryService.update(dto);
  }

  @UseGuards(BotGuard)
  @Post('delete')
  async delete(@Body(new ValidationPipe()) dto: DeleteCategoryDto) {
    await this.categoryService.delete(dto.id);
  }
}
