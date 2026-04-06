import type { ITransaction } from "./Transaction.interface";

export interface ITransactionWithDate extends Omit<ITransaction, "createdAt"> {
  createdAt: Date;
}
