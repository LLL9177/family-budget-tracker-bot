import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileService } from './services/File.service';
import { FileTypeEnum } from 'src/enums/FileType.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uplodaImage(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.upload(file.buffer, FileTypeEnum.FAMILY_AVATAR);
  }

  @Get('/image')
  async getImage(@Query('id', new ValidationPipe()) id: string) {
    return await this.fileService.get(id);
  }
}
