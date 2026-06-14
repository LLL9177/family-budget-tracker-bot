import { IsNumber, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  telegramId: bigint

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  createdAt: string;
}
