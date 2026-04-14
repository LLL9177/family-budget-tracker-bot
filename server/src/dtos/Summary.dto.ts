import { IsNumber, IsUUID } from 'class-validator';

export class SummaryDto {
  @IsUUID()
  familyId: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;
}
