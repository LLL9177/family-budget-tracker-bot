import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '../user/entities/User.entity';
import { FamilyEntity } from '../family/entities/Family.entity';
import { TransactionEntity } from '../transaction/entities/Transaction.entity';
import { MonthlySummaryEntity } from '../transaction/entities/MonthlySummary.entity';
import { OneTimePasswordEntity } from '../one-time-password/entities/OneTimePassword.entity';
import { FileEntity } from '../file/entities/File.entity';
import { NotificationEntity } from '../notification/entities/Notifitcation.entity';
import { TelegramEntity } from '../telegram/entities/Telegram.entity';
import { CategoryEntity } from '../category/entities/Category.entity';
import { GlobalCategoryEntity } from '../category/entities/GlobalCategory.entity';
dotenv.config();

export const AppDataSource = new DataSource({
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
    GlobalCategoryEntity,
  ],
  synchronize: false,
  migrations: [__dirname + '/*migrations.ts'],
});
