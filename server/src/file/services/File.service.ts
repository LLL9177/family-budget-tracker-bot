import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/File.entity';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

interface IFileService {
  upload(file: Buffer): Promise<void>;
}

@Injectable()
export class FileService implements IFileService {
  constructor(private readonly fileRepository: Repository<FileEntity>) {}

  async upload(file: Buffer): Promise<void> {
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

    async function uploadToCloudinary(file: Buffer) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
            resource_type: 'image',
            format: 'webp',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(optimized);
      });
    }
    const url = cloudin;
  }
}
