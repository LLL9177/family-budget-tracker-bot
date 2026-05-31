import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './services/Family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './entities/Family.entity';
import { HashService } from 'src/auth/services/Hash.service';
import { UserModule } from 'src/user/user.module';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([FamilyEntity]),
    UserModule,
    FileModule,
  ],
  controllers: [FamilyController],
  providers: [FamilyService, HashService],
  exports: [FamilyService],
})
export class FamilyModule {}
 