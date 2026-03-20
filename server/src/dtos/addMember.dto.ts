import { IsNumber, IsString } from 'class-validator';

export class AddRemoveMemberDto {
  @IsNumber()
  user_id: string;

  @IsString()
  family_uuid: string;
}
