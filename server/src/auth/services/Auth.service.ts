import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/User.service';
import { JwtTokenService } from 'src/jwt/Jwt.service';
import { LoginDto } from 'src/dtos/login.dto';
import { Roles } from '../enums/Roles.enum';
import { HashService } from './Hash.service';
import { UserEntity } from 'src/user/entities/User.entity';
import { IAccessToken } from 'src/types/IAccessToken.interface';
import { GoogleAuthDto } from 'src/dtos/GoogleAuth.dto';
import { IGoogleAuth } from 'src/types/GoogleAuth.interface';
import { OneTimePasswordService } from '../../one-time-password/services/OneTimePassword.service';
import { UserDto } from '../../dtos/user.dto';
import { TelegramService } from '../../telegram/services/Telegram.service';
import { BotLoginDto } from '../../dtos/BotLogin.dto';
import { BotGoogleLoginDto } from '../../dtos/BotGoogleLogin.dto';
import { IUser } from '../../types/User.interface';

interface IAuthService {
  register(data: UserDto): Promise<IAccessToken | void>; // although it will 100% return the first option
  getProfile(user_id: string): Promise<UserEntity>;
  login(data: LoginDto): Promise<IAccessToken | void>;
  botLogin(data: BotLoginDto): Promise<void>;
  googleAuth(data: GoogleAuthDto): Promise<IAccessToken | void>;
  botGoogleAuth(data: BotGoogleLoginDto): Promise<IAccessToken | void>;
  botGetProfile(telegramId: bigint): Promise<IUser>;
  telegramLogout(userId: string): Promise<void>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtTokenService,
    private readonly hashService: HashService,
    private readonly otpService: OneTimePasswordService,
    private readonly telegramService: TelegramService,
  ) {}

  async register(data: UserDto): Promise<IAccessToken | void> {
    const user = await this.userService.findByUsername(data.username);

    if (!user) {
      if (data.username.length > 40)
        throw new BadRequestException('Username is too long');
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

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.userService.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    delete user.googleId;

    return user;
  }

  async login(data: LoginDto): Promise<IAccessToken | void> {
    if (!data.username && !data.email) {
      throw new BadRequestException('Provide either username or email');
    }

    const user = data.username
      ? ((await this.userService.findByUsername(data.username)) as UserEntity)
      : ((await this.userService.findByEmail(data.email!)) as UserEntity);

    if (user) {
      if (!user.password)
        throw new BadRequestException('The user is logged in using google');
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

  async botLogin(data: BotLoginDto): Promise<void> {
    const user = await this.userService.findById(data.userId, false, true);
    if (!user || !user.password) throw new NotFoundException('User not found');

    if (!this.hashService.compare(data.password, user.password))
      throw new UnauthorizedException();

    await this.telegramService.create({ ...data });
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

    const { password, otpId } = await this.otpService.create();

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

    await this.otpService.syncUser(userId, otpId);

    return { ...access, password };
  }

  async botGoogleAuth(data: BotGoogleLoginDto): Promise<IAccessToken | void> {
    const user = await this.userService.findById(data.userId, false);
    if (!user) throw new NotFoundException('User not found');

    if (!(await this.otpService.validate(data.oneTimePassword, user.id)))
      throw new BadRequestException('Not a valid one-time password');

    await this.telegramService.create({
      ...data,
    });
  }

  async botGetProfile(telegramId: bigint): Promise<IUser> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    delete user.googleId;
    return user;
  }

  async telegramLogout(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.telegramId = null;
    await this.userService.changeUser(user);
  }
}
