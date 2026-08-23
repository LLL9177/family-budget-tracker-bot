import { IsUUID } from 'class-validator';

export class DeleteCategoryDto {
  @IsUUID()
  id: string;
}
