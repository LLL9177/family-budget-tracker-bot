import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../auth/services/Hash.service';
import { UserEntity } from './entities/User.entity';
import { FileService } from '../file/services/File.service';
import { FileTypeEnum } from '../enums/FileType.enum';

interface IUserService {
  create(user: UserDto): Promise<void>;
  findById(id: string, getOwned: boolean): Promise<UserEntity | null>;
  findByUsername(
    username: string,
    getOwned: boolean,
  ): Promise<UserEntity | null>;
  findByEmail(email: string, getOwned: boolean): Promise<UserEntity | null>;
  findByGoogleId(
    googleId: string,
    getOwned: boolean,
  ): Promise<UserEntity | null>;
  changeUser(newUser: UserEntity): Promise<void>;
  userType(id: string): Promise<'google' | 'local'>;
  setAvatar(file: Express.Multer.File, userId: string): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
    private readonly fileService: FileService,
  ) {}

  async create(data: UserDto): Promise<void> {
    await this.userRepository.insert({
      email: data.email,
      username: data.username,
      password: this.hashService.hash(data.password),
    });
  }

  async findById(
    id: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        family: {
          joinRequests: true,
          owner: true,
          members: {
            avatar: true,
          },
          avatar: true,
          banner: true,
        },
        familyOwned: getOwned,
        avatar: true,
        notifications: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    return user;
  }

  async findByUsername(
    username: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: { family: true, familyOwned: getOwned, avatar: true },
    });
  }

  async findByEmail(
    email: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: { family: true, familyOwned: getOwned, avatar: true },
    });
  }

  async findByGoogleId(
    googleId: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { googleId },
      relations: { family: true, familyOwned: getOwned, avatar: true },
    });
  }

  async changeUser(newUser: UserEntity): Promise<void> {
    await this.userRepository.save(newUser);
  }

  async userType(id: string): Promise<'google' | 'local'> {
    const user = await this.userRepository.findOneBy({ id });
    console.log(user);
    if (!user) throw new NotFoundException('User not found');
    if (user?.googleId) return 'google';
    return 'local';
  }

  async setAvatar(file: Express.Multer.File, userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const avatar = await this.fileService.upload(
      file.buffer,
      FileTypeEnum.USER_AVATAR,
    );

    user.avatar = avatar;
    await this.userRepository.save(user);
  }
}
