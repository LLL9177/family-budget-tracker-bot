import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTelegramRequestDto {
  @IsNumber()
  telegramId: bigint;

  @IsString()
  telegramUsername: string;

  @IsUUID()
  userId: string;
}
