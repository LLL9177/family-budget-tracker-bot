import type { ITransaction } from "@/types/Transaction.interface";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import { createContext } from "react";

export const TransactionsContext = createContext({
  transactions: [],
  setTransactions: () => {},
} as {
  transactions: [] | ITransaction[] | ITransactionWithDate[];
  setTransactions: (
    value: ITransaction[] | ITransactionWithDate[]
  ) => void;
});
