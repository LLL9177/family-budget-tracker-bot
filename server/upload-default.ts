import { readFile } from 'fs/promises';
import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import { FileEntity } from './src/file/entities/File.entity';
import { FileTypeEnum } from './src/enums/FileType.enum';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [FileEntity],
});

async function uploadToCloudinary(file: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        resource_type: 'image',
        format: 'webp',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));

        resolve(result);
      },
    );

    stream.end(file);
  });
}

async function main() {
  await dataSource.initialize();

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  const fileRepository = dataSource.getRepository(FileEntity);

  const file = await readFile('./default-family-banner.jpg');

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

  const uploadResult = await uploadToCloudinary(optimized);

  const savedFile = await fileRepository.save({
    type: FileTypeEnum.FAMILY_BANNER,
    url: uploadResult.secure_url,
  });

  console.log('Created file:');
  console.log(savedFile);
  console.log('File ID:', savedFile.id);
}

main()
  .catch(console.error)
  .finally(async () => {
    await dataSource.destroy();
  });
