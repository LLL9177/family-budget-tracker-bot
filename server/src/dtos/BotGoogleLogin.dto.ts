import { IsString, IsUUID } from 'class-validator';

export class BotGoogleLoginDto {
  @IsUUID()
  userId: string;

  @IsString()
  oneTimePassword: string;

  @IsString()
  botToken: string;
}
