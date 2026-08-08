import { IsNumber, IsString, IsOptional } from 'class-validator';
import { IsBigInt } from '../decorators/IsBigInt.decorator';

export class TransactionDto {
  @IsBigInt()
  telegramId: bigint;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
