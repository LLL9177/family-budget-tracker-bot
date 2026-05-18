import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FileTypeEnum } from '../../enums/FileType.enum';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ enum: FileTypeEnum })
  type: FileTypeEnum;
}
