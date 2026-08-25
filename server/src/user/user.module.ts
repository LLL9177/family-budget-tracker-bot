import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/User.entity';
import { HashService } from 'src/auth/services/Hash.service';
import { UserService } from './User.service';
import { UserController } from './user.controller';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    FileModule,
    forwardRef(() => AuthModule),
    CategoryModule,
    
  ],
  providers: [UserService, HashService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
