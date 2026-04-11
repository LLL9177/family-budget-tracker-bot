export interface IFamilyData {
  pnl: number;
  totalSpent: number;
  totalEarned: number;
  mostSpentOn: {
    key: string | null;
    value: number;
  };
  leastSpentOn: {
    key: string | null,
    value: number;
  };
  mostEarnedFrom: {
    key: string | null;
    value: number;
  };
  leastEarnedFrom: {
    key: string | null;
    value: number;
  };
  topSpender: {
    spender: string; // for now
    value: number;
  };
  smallestSpender: {
    spender: string; // for now
    value: number;
  };
  topEarner: {
    earner: string; // for now
    value: number;
  };
  smallestEarner: {
    earner: string; // for now
    value: number;
  }
}
