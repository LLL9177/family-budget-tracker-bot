import { IsString } from 'class-validator';
import { CreateTelegramRequestDto } from './CreateTelegramRequest.dto';

export class BotGoogleLoginDto extends CreateTelegramRequestDto {
  @IsString()
  oneTimePassword: string;
}
