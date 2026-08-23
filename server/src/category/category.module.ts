import { forwardRef, Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { FamilyModule } from '../family/family.module';
import { CategoryService } from './services/Category.service';
import { GlobalCategoryService } from './services/GlobalCategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/Category.entity';
import { GlobalCategoryEntity } from './entities/GlobalCategory.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => FamilyModule),
    TypeOrmModule.forFeature([CategoryEntity, GlobalCategoryEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, GlobalCategoryService],
  exports: [CategoryService, GlobalCategoryService],
})
export class CategoryModule {}
