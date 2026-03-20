import { IsNumber, IsString } from 'class-validator';

export class EditCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  newCategory: string;
}
