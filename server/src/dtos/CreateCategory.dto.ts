import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsBigInt } from 'src/decorators/IsBigInt.decorator';
import { CategoryUsedInEnum } from 'src/enums/CategoryUserIn.enum';

export class CreateCategoryDto {
  @IsBigInt()
  userId: bigint;

  @IsOptional()
  @IsString()
  eng?: string;

  @IsOptional()
  @IsString()
  ukr?: string;

  @IsEnum(CategoryUsedInEnum)
  usedIn: CategoryUsedInEnum;
}
