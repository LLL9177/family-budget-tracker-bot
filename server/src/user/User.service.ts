import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../auth/services/Hash.service';
import { UserEntity } from './entities/User.entity';

interface IUserService {
  create(user: UserDto): Promise<void>;
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
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
      username: data.username,
      password: this.hashService.hash(data.password),
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ username });
  }

  async changeUser(newUser: UserEntity): Promise<void> {
    await this.userRepository.save(newUser);
  }
}
