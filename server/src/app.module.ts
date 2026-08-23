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
import { FileEntity } from './file/entities/File.entity';
import { NotificationModule } from './notification/notification.module';
import { NotificationEntity } from './notification/entities/Notifitcation.entity';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramEntity } from './telegram/entities/Telegram.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/Category.entity';
import { GlobalCategoryEntity } from './category/entities/GlobalCategory.entity';

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
        FileEntity,
        NotificationEntity,
        TelegramEntity,
        CategoryEntity,
        GlobalCategoryEntity
      ],
      synchronize: false,
    }),
    FamilyModule,
    TransactionModule,
    UserModule,
    OneTimePasswordModule,
    FileModule,
    NotificationModule,
    TelegramModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    CategoryModule,
  ],
  controllers: [AuthController, FamilyController],
})
export class AppModule {}
