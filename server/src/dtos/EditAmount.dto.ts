import { IsNumber } from 'class-validator';

export class EditAmountDto {
  @IsNumber()
  id: number;

  @IsNumber()
  newAmount: number;
}
