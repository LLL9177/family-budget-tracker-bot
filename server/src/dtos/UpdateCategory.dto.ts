import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CategoryUsedInEnum } from 'src/enums/CategoryUserIn.enum';

export class UpdateCategoryDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  ukr: string;

  @IsOptional()
  @IsString()
  eng: string;

  @IsEnum(CategoryUsedInEnum)
  usedIn: CategoryUsedInEnum;
}
