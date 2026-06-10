import type { IconEnum } from "@/enums/IconEnum";

export interface INotification {
  id: string;
  title: string;
  body: string;
  icon: IconEnum;
}
