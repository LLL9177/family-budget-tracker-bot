import { IsNumber, IsString } from 'class-validator';

export class SummaryDto {
  @IsString()
  familyId: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;
}
