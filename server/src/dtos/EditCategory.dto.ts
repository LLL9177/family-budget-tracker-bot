import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CategoryTypeEnum } from 'src/enums/CategoryType.enum';

export class EditCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  newCategory: string;

  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;
}
