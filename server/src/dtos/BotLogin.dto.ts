import { IsString } from 'class-validator';
import { CreateTelegramRequestDto } from './CreateTelegramRequest.dto';

export class BotLoginDto extends CreateTelegramRequestDto {
  @IsString()
  password: string;
} 
