import { IsUUID } from 'class-validator';

export class DeleteNotificationDto {
  @IsUUID()
  id: string;
}
