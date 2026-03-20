import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  repeat_password: string;
}
