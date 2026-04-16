import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FamilyService } from './services/Family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './entities/Family.entity';
import { HashService } from 'src/auth/services/Hash.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FamilyEntity]), UserModule],
  controllers: [FamilyController],
  providers: [FamilyService, HashService],
  exports: [FamilyService],
})
export class FamilyModule {}
