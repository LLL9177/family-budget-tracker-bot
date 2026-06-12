import { IsUUID } from 'class-validator';

export class AcceptDenyTelegramRequestDto {
  @IsUUID()
  id: string;
}
