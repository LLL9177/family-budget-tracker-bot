import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

export class setTelegramDto {
  @Transform(({ value }) => {
    try {
      return BigInt(value);
    } catch {
      return value; // leave it broken so validator can catch it
    }
  })
  @ValidateIf((obj, value) => typeof value === 'bigint')
  telegramId: bigint;
}
