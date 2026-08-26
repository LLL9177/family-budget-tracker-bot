import type { ICategory } from "@/types/Category.interface";

export interface IFamilyData {
  pnl: number;
  totalSpent: number;
  totalEarned: number;
  mostSpentOn: {
    key: ICategory | string | null;
    value: number;
  };
  leastSpentOn: {
    key: ICategory | string | null;
    value: number;
  };
  mostEarnedFrom: {
    key: ICategory | string | null;
    value: number;
  };
  leastEarnedFrom: {
    key: ICategory | string | null;
    value: number;
  };
  topSpender: {
    spender: string;
    value: number;
  };
  smallestSpender: {
    spender: string;
    value: number;
  };
  topEarner: {
    earner: string;
    value: number;
  };
  smallestEarner: {
    earner: string;
    value: number;
  };
}
