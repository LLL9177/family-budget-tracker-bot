import { IsNumber, IsString } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  name: string;
}
