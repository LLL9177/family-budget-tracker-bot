import { IsString } from 'class-validator';

export class BotLoginDto {
  @IsString()
  password: string;

  @IsString()
  userId: string;
}
