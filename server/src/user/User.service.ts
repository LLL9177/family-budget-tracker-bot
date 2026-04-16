import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../auth/services/Hash.service';
import { UserEntity } from './entities/User.entity';

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
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
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
    return this.userRepository.findOne({
      where: { id },
      relations: { family: true, familyOwned: getOwned },
    });
  }

  async findByUsername(
    username: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: { family: true, familyOwned: getOwned },
    });
  }

  async findByEmail(
    email: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: { family: true, familyOwned: getOwned },
    });
  }

  async findByGoogleId(
    googleId: string,
    getOwned: boolean = false,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { googleId },
      relations: { family: true, familyOwned: getOwned },
    });
  }

  async changeUser(newUser: UserEntity): Promise<void> {
    await this.userRepository.save(newUser);
  }
}
