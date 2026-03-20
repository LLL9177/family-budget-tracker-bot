import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/User.entity';
import { FamilyModule } from './family/family.module';
import { FamilyEntity } from './family/entities/Family.entity';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionEntity } from './transaction/entities/Transaction.entity';
import { MonthlySummaryEntity } from './transaction/entities/MonthlySummary.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'root',
      database: process.env.DB_NAME ?? 'database',
      entities: [
        UserEntity,
        FamilyEntity,
        TransactionEntity,
        MonthlySummaryEntity,
      ],
      synchronize: true,
    }),
    FamilyModule,
    TransactionModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
