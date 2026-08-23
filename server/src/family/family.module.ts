import { forwardRef, Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './services/Family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './entities/Family.entity';
import { HashService } from 'src/auth/services/Hash.service';
import { UserModule } from 'src/user/user.module';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([FamilyEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    NotificationModule,
    forwardRef(() => CategoryModule),
  ],
  controllers: [FamilyController],
  providers: [FamilyService, HashService],
  exports: [FamilyService],
})
export class FamilyModule {}
