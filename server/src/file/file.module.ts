import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './services/File.service';
import { FamilyModule } from 'src/family/family.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/File.entity';

@Module({
  imports: [FamilyModule, TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
