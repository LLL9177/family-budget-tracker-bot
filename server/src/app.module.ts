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
import { UserModule } from './user/user.module';
import { OneTimePasswordModule } from './one-time-password/one-time-password.module';
import { OneTimePasswordEntity } from './one-time-password/entities/OneTimePassword.entity';
import { FamilyController } from './family/family.controller';
import { FileModule } from './file/file.module';

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
        OneTimePasswordEntity,
      ],
      synchronize: true,
    }),
    FamilyModule,
    TransactionModule,
    UserModule,
    OneTimePasswordModule,
    FileModule,
  ],
  controllers: [AuthController, FamilyController],
})
export class AppModule {}
