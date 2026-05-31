import { FileEntity } from '../../file/entities/File.entity';
import { UserEntity } from '../../user/entities/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FamilyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => UserEntity, (user: UserEntity) => user.family)
  members: UserEntity[];

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.requestingToJoinFamily)
  joinRequests: UserEntity[];

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn()
  avatar?: FileEntity;

  @OneToOne(() => FileEntity)
  @JoinColumn()
  banner: FileEntity;
}
