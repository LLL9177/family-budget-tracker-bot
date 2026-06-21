import type { NotificationKeyEnum } from "@/enums/NotificationKeyEnum";

export interface INotificationResource {
  key: NotificationKeyEnum;
  meta: Record<string, string>;
  lang: "en" | "uk";
}
