import { IsString, IsUUID } from 'class-validator';
import { IsBigInt } from '../decorators/IsBigInt.decorator';

export class CreateTelegramRequestDto {
  @IsBigInt()
  telegramId: bigint;

  @IsString()
  telegramUsername: string;

  @IsUUID()
  userId: string;
}
