import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './services/Transaction.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/auth/enums/Roles.enum';
import { Role } from 'src/roles/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditCategoryDto } from 'src/dtos/EditCategory.dto';
import { EditAmountDto } from 'src/dtos/EditAmount.dto';
import { SummaryDto } from 'src/dtos/Summary.dto';
import { SummaryService } from './services/Summary.service';
import { GetUserDto } from '../dtos/getUser.dto';
import { FamilyGuard } from '../family/family.guard';
import { BotGuard } from '../bot/bot.guard';
import { TransactionDto } from '../dtos/Transaction.dto';
import { CategoryTypeEnum } from 'src/enums/CategoryType.enum';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly summaryService: SummaryService,
  ) {}

  @UseGuards(BotGuard)
  @Post('new')
  async newTransaction(@Body(new ValidationPipe()) dto: TransactionDto) {
    await this.transactionService.create(dto);
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('find')
  async find(@Query('id') id: number) {
    return await this.transactionService.findById(id);
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get_family_transactions')
  async getFamilyTransactions(@Query('family_uuid') familyUuid: string) {
    return await this.transactionService.findByFamilyId(familyUuid);
  }

  @UseGuards(BotGuard)
  @Get('bot/get_family_transactions')
  async botGetFamilyTransactions(@Query('telegram_id') telegramId: bigint) {
    return await this.transactionService.botGetFamilyTransactions(telegramId);
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get_user_transactions')
  async getUserTransactions(@Req() req: { user: { id: string } }) {
    return await this.transactionService.findByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('get_by_user')
  async getByUser(@Query(new ValidationPipe()) dto: GetUserDto) {
    return await this.transactionService.findByUserId(dto.id);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('edit_category')
  async editCategory(@Body(new ValidationPipe()) body: EditCategoryDto) {
    return await this.transactionService.editCategory(
      body.id,
      body.newCategory,
      body.type
    );
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('edit_amount')
  async editAmount(@Body(new ValidationPipe()) body: EditAmountDto) {
    return await this.transactionService.editAmount(body.id, body.newAmount);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('delete')
  async delete(@Query('id') id: number) {
    await this.transactionService.delete(id);
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('monthly_summary')
  async monthlySummary(@Body(new ValidationPipe()) body: SummaryDto) {
    return await this.summaryService.sum(body);
  }

  @UseGuards(BotGuard)
  @Get('bot/get_user_transactions')
  async botGetUserTransactions(@Query('telegram_id') telegramId: bigint) {
    return await this.transactionService.botGetUserTransactions(telegramId);
  }
}
