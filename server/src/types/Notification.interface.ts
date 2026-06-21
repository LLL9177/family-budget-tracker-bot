import { IconEnum } from '../enums/Icon.enum';
import { NotificationKeyEnum } from '../enums/NotificationKey.enum';

export interface INotification {
  key: NotificationKeyEnum;
  icon: IconEnum;
  meta?: Record<string, string>;
}
