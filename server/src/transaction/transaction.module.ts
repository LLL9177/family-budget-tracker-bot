import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/Transaction.entity';
import { TransactionService } from './services/Transaction.service';
import { AuthModule } from 'src/auth/auth.module';
import { MonthlySummaryEntity } from './entities/MonthlySummary.entity';
import { SummaryService } from './services/Summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, MonthlySummaryEntity]),
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, SummaryService],
})
export class TransactionModule {}
