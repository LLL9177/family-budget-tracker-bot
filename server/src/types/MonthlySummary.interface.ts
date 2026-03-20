export interface IMonthlySummary {
  totalSpent: number;
  totalEarned: number;
  pnl: number;
  topCategory: string;
  topSpenderId: string | undefined;
  topEarnerId: string | undefined;
}
