import { IsUUID } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  id: string;
}
