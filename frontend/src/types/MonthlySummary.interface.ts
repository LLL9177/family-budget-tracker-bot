import type { ICategory } from "./Category.interface";

export interface IMonthlySummary {
  totalSpent: number;
  totalEarned: number;
  pnl: number;
  mostSpentOn: ICategory | string;
  mostEarnedFrom: ICategory | string;
  topSpenderId: string | undefined;
  topEarnerId: string | undefined;
}
