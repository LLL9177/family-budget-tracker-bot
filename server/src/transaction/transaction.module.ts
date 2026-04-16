import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/Transaction.entity';
import { TransactionService } from './services/Transaction.service';
import { AuthModule } from 'src/auth/auth.module';
import { MonthlySummaryEntity } from './entities/MonthlySummary.entity';
import { SummaryService } from './services/Summary.service';
import { UserEntity } from 'src/user/entities/User.entity';
import { UserModule } from 'src/user/user.module';
import { FamilyModule } from 'src/family/family.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      MonthlySummaryEntity,
      UserEntity,
    ]),
    AuthModule,
    UserModule,
    FamilyModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, SummaryService],
})
export class TransactionModule {}
