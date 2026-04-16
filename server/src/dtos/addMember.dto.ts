import { IsNumber, IsString } from 'class-validator';

export class AddRemoveMemberDto {
  @IsString()
  user_id: string;

  @IsString()
  family_uuid: string;
}
