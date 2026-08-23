export interface ITransaction {
  telegramId: bigint;
  amount: number;
  category: string; // will probably be id
  createdAt: string;
  comment?: string;
}
