import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './services/File.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeEnum } from '../enums/FileType.enum';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.upload(
      file.buffer,
      FileTypeEnum.FAMILY_BANNER,
    );
  }
}
