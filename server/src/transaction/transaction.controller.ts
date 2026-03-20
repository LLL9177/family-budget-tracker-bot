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
import { TransactionDto } from 'src/dtos/Transaction.dto';
import { EditCategoryDto } from 'src/dtos/EditCategory.dto';
import { EditAmountDto } from 'src/dtos/EditAmount.dto';
import { SummaryDto } from 'src/dtos/Summary.dto';
import { SummaryService } from './services/Summary.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly summaryService: SummaryService,
  ) {}

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('new')
  async newTransaction(
    @Body(new ValidationPipe()) body: TransactionDto,
    @Req() req: { user: { id: string } },
  ) {
    const data = { ...body, userId: req.user.id };
    await this.transactionService.create(data);
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

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get_user_transactions')
  async getUserTransactions(@Req() req: { user: { id: string } }) {
    return await this.transactionService.findByUserId(req.user.id);
  }

  @Role(Roles.FAMILY_OWNER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('edit_category')
  async editCategory(@Body(new ValidationPipe()) body: EditCategoryDto) {
    return await this.transactionService.editCategory(
      body.id,
      body.newCategory,
    );
  }

  @Role(Roles.FAMILY_OWNER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('edit_amount')
  async editAmount(@Body(new ValidationPipe()) body: EditAmountDto) {
    return await this.transactionService.editAmount(body.id, body.newAmount);
  }

  @Role(Roles.FAMILY_OWNER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('delete')
  async delete(@Query('id') id: number) {
    await this.transactionService.delete(id);
  }

  @Role(Roles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('monthly_summary')
  async monthlySummary(@Body() body: SummaryDto) {
    return await this.summaryService.sum(body);
  }
}
