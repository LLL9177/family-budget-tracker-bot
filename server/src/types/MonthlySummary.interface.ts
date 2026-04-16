import { UserEntity } from 'src/user/entities/User.entity';

export interface IMonthlySummary {
  totalSpent: number;
  totalEarned: number;
  pnl: number;
  mostSpentOn: string;
  mostEarnedFrom: string;
  topSpender: UserEntity | undefined;
  topEarner: UserEntity | undefined;
}
