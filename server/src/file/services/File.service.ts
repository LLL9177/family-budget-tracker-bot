import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';

import { FileEntity } from '../entities/File.entity';
import { FileTypeEnum } from 'src/enums/FileType.enum';

interface IFileService {
  upload(file: Buffer, type: FileTypeEnum): Promise<FileEntity>;
  get(id: string): Promise<FileEntity>;
}

@Injectable()
export class FileService implements IFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async upload(file: Buffer, type: FileTypeEnum): Promise<FileEntity> {
    const optimized = await sharp(file)
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toBuffer();

    const uploadResult = await this.uploadToCloudinary(optimized);

    return this.fileRepository.save({
      type,
      url: uploadResult.secure_url,
    });
  }

  private async uploadToCloudinary(file: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER_NAME,
          resource_type: 'image',
          format: 'webp',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error('Upload failed'));
          }

          resolve(result);
        },
      );

      stream.end(file);
    });
  }

  async get(id: string): Promise<FileEntity> {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) throw new Error('File not found');

    return file;
  }
}
