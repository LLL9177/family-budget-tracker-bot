export interface IMonthlySummary {
  totalSpent: number;
  totalEarned: number;
  pnl: number;
  mostSpentOn: string;
  mostEarnedFrom: string;
  topSpenderId: string | undefined;
  topEarnerId: string | undefined;
}
