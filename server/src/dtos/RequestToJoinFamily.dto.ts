import { IsUUID } from 'class-validator';

export class RequestToJoinFamilyDto {
  @IsUUID()
  familyId: string;
}
