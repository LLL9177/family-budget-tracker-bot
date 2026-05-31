import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './services/File.service';
import { FamilyModule } from 'src/family/family.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/File.entity';
import { FileController } from './file.controller';

@Module({
  imports: [
    forwardRef(() => FamilyModule),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
