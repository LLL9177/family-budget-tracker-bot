import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  googleId: string;
}
