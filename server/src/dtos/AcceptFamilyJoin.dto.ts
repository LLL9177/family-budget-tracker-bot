import { IsUUID } from 'class-validator';

export class AcceptFamilyJoinDto {
  @IsUUID()
  id: string;
}
