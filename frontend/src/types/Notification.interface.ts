import type { IconEnum } from "@/enums/IconEnum";
import type { NotificationKeyEnum } from "@/enums/NotificationKeyEnum";

export interface INotification {
  id: string;
  key: NotificationKeyEnum;
  meta?: Record<string, string>;
  icon: IconEnum;
}
