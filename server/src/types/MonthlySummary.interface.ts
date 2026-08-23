import { CategoryEntity } from 'src/category/entities/Category.entity';
import { GlobalCategoryEntity } from 'src/category/entities/GlobalCategory.entity';
import { UserEntity } from 'src/user/entities/User.entity';

export interface IMonthlySummary {
  totalSpent: number;
  totalEarned: number;
  pnl: number;
  mostSpentOn?: CategoryEntity;
  mostSpentOnGlobal?: GlobalCategoryEntity;
  mostEarnedFrom?: CategoryEntity;
  mostEarnedFromGlobal?: GlobalCategoryEntity
  topSpender: UserEntity | undefined;
  topEarner: UserEntity | undefined;
}
