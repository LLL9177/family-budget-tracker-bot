import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTelegramRequestDto {
  @IsNumber()
  telegramId: number;

  @IsString()
  telegramUsername: string;

  @IsUUID()
  userId: string;
}
