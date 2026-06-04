import type { IUser } from "./User.interface";

export interface ITransaction {
  id: number;
  user: IUser;
  familyId: string;
  amount: number;
  category: string;
  createdAt: string | Date;
}
