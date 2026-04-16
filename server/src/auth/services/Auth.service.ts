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
import { GoogleAuthDto } from 'src/dtos/GoogleAuth.dto';
import { IGoogleAuth } from 'src/types/GoogleAuth.interface';

interface IAuthService {
  register(data: UserDto): Promise<IAccessToken | void>; // although it will 100% return the first option
  getProfile(user_id: string);
  login(data: LoginDto): Promise<IAccessToken | void>;
  botLogin(data: BotLoginDto): Promise<IAccessToken | void>;
  botGetUsername(id: string): Promise<string>;
  googleAuth(data: GoogleAuthDto): Promise<IAccessToken | void>;
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

    console.log(data);
    if (user) {
      console.log(user);
      console.log(this.hashService.compare(data.password, user.password));
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

  async googleAuth(data: GoogleAuthDto): Promise<IGoogleAuth | void> {
    const existingUser = await this.userService.findByUsername(data.username);

    if (existingUser) {
      existingUser.googleId = data.googleId;
      await this.userService.changeUser(existingUser);

      const jwt = this.jwtService.sign({
        id: existingUser.id,
        roles: JSON.parse(existingUser.roles) as Roles[],
      });

      return { access_token: jwt };
    }

    const oldUser = await this.userService.findByGoogleId(data.googleId);

    if (oldUser) {
      const jwt = this.jwtService.sign({
        id: oldUser.id,
        roles: JSON.parse(oldUser.roles) as Roles[],
      });

      return { access_token: jwt };
    }

    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    const array = new Uint8Array(16);
    crypto.getRandomValues(array);

    const password = Array.from(
      array,
      (byte) => charset[byte % charset.length],
    ).join('');

    console.log(password);

    const access = await this.register({
      username: data.username,
      email: data.email,
      password,
      repeat_password: password,
    });

    if (!access) throw new Error('No access');

    const userId = this.jwtService.validateAccess(
      access.access_token.access,
    ).id;

    const user = (await this.userService.findById(userId)) as UserEntity;

    user.googleId = data.googleId;

    await this.userService.changeUser(user);
    return { ...access, password }; // i know, but this is the only way for them to know their password.
  }
}
