import { IsEnum, IsString, IsUUID } from 'class-validator';
import { IsBigInt } from '../decorators/IsBigInt.decorator';

enum Lang {
  en = 'en',
  uk = 'uk',
}

export class CreateTelegramRequestDto {
  @IsBigInt()
  telegramId: bigint;

  @IsString()
  telegramUsername: string;

  @IsUUID()
  userId: string;

  @IsBigInt()
  chatId: bigint;

  @IsEnum(Lang)
  lang: Lang;
}
