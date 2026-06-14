import { IsBigInt } from '../decorators/IsBigInt.decorator';

export class setTelegramDto {
  @IsBigInt()
  telegramId: bigint;
}
