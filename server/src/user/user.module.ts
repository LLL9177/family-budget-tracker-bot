import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/User.entity';
import { HashService } from 'src/auth/services/Hash.service';
import { UserService } from './User.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, HashService],
  exports: [UserService],
})
export class UserModule {}
