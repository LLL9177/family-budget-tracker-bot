import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/User.entity';
import { HashService } from 'src/auth/services/Hash.service';
import { UserService } from './User.service';
import { UserController } from './user.controller';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    FileModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, HashService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
