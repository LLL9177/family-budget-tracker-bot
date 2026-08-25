import { CategoryEntity } from '../../category/entities/Category.entity';
import { FileEntity } from '../../file/entities/File.entity';
import { UserEntity } from '../../user/entities/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalCategoryEntity } from '../../category/entities/GlobalCategory.entity';

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

  @OneToMany(() => CategoryEntity, (category) => category.family)
  categories: CategoryEntity[];

  @JoinTable()
  @ManyToMany(
    () => GlobalCategoryEntity,
    (globalCategories) => globalCategories.families,
  )
  globalCategories: GlobalCategoryEntity[];
}
