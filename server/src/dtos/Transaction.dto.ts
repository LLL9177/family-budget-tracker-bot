import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { IsBigInt } from '../decorators/IsBigInt.decorator';
import { CategoryTypeEnum } from 'src/enums/CategoryType.enum';

export class TransactionDto {
  @IsBigInt()
  telegramId: bigint;

  @IsNumber()
  amount: number;

  @IsUUID()
  category: string;

  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  comment?: string;
}