import { IsUUID } from 'class-validator';

export class GetCategoriesByUserDto {
  @IsUUID()
  id: string;
}
