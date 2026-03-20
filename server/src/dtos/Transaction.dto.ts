import { IsNumber, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  familyId: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  createdAt: string;
}
