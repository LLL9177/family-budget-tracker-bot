import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FamilyService } from './services/Family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './entities/Family.entity';
import { UserService } from 'src/user/User.service';
import { UserEntity } from 'src/user/entities/User.entity';
import { HashService } from 'src/auth/services/Hash.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FamilyEntity, UserEntity])],
  controllers: [FamilyController],
  providers: [FamilyService, UserService, HashService],
})
export class FamilyModule {}
