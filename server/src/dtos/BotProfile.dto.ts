import { IsBigInt } from '../decorators/IsBigInt.decorator';

export class BotProfileDto {
  @IsBigInt()
  telegram_id: bigint
}