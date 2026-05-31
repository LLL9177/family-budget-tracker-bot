import { IsUUID } from 'class-validator';

export class RejectFamilyJoinDto {
  @IsUUID()
  id: string;
}
