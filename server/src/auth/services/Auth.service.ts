import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { UserService } from '../../user/User.service';
import { JwtTokenService } from 'src/jwt/Jwt.service';
import { LoginDto } from 'src/dtos/login.dto';
import { Roles } from '../enums/Roles.enum';
import { HashService } from './Hash.service';
import { UserEntity } from 'src/user/entities/User.entity';
import { IAccessToken } from 'src/types/IAccessToken.interface';
import { BotLoginDto } from 'src/dtos/BotLogin.dto';

interface IAuthService {
  register(data: UserDto): Promise<IAccessToken | void>; // although it will 100% return the first option
  getProfile(user_id: string);
  login(data: LoginDto): Promise<IAccessToken | void>;
  botLogin(data: BotLoginDto): Promise<IAccessToken | void>;
  botGetUsername(id: string): Promise<string>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtTokenService,
    private readonly hashService: HashService,
  ) {}

  async register(data: UserDto): Promise<IAccessToken | void> {
    const user = await this.userService.findByUsername(data.username);

    if (!user) {
      if (data.password == data.repeat_password) {
        await this.userService.create(data);
        return await this.login({
          username: data.username,
          password: data.password,
        });
      } else throw new UnauthorizedException();
    } else
      throw new ConflictException('User with this username already exists');
  }

  async getProfile(userId: string) {
    const user = (await this.userService.findById(userId)) as UserEntity;

    if (!user) throw new NotFoundException('User not found');

    const { id, password, ...ret } = user;
    return ret;
  }

  async login(data: LoginDto): Promise<IAccessToken | void> {
    if (!data.username && !data.email) {
      throw new BadRequestException('Provide either username or email');
    }

    const user = data.username
      ? ((await this.userService.findByUsername(data.username)) as UserEntity)
      : ((await this.userService.findByEmail(data.email!)) as UserEntity);

    if (user) {
      if (this.hashService.compare(data.password, user.password)) {
        return {
          access_token: this.jwtService.sign({
            id: user.id,
            roles: JSON.parse(user.roles) as Roles[],
          }),
        };
      }
    }
    throw new UnauthorizedException('Incorrect username or password');
  }

  async botLogin(data: BotLoginDto): Promise<IAccessToken | void> {
    const user = (await this.getProfile(data.userId)) as UserEntity;

    return await this.login({
      username: user.username,
      password: data.password,
    });
  }

  async botGetUsername(id: string): Promise<string> {
    const user = (await this.getProfile(id)) as UserEntity;
    if (!user) throw new NotFoundException('User not found');

    return user.username;
  }
}
