import type { RolesEnum } from "@/enums/RolesEnum";
import type { IFamily } from "./Family.interface";
import type { INotification } from "./Notification.interface";
import type { ITransaction } from "./Transaction.interface";
import type { ITelegramRequest } from "./TelegramRequest.interface";

export interface IUserData {
  id: string;
  username: string;
  avatar: { url: string };
  family: IFamily;
  familyOwned?: { id: string } | null;
  email: string;
  roles: RolesEnum[];
  notifications: INotification[];
  transactions: ITransaction[];
  telegramRequests: ITelegramRequest[];
}
