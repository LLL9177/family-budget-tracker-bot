import { Roles } from 'src/auth/enums/Roles.enum';
import { FamilyEntity } from 'src/family/entities/Family.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../file/entities/File.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: JSON.stringify([Roles.USER]) })
  roles: string; // json arr

  @ManyToOne(() => FamilyEntity, (family) => family.members)
  family: FamilyEntity;

  @OneToOne(() => FamilyEntity, (family) => family.owner)
  @JoinColumn()
  familyOwned: FamilyEntity;

  @Column({ nullable: true })
  googleId?: string;

  @ManyToOne(
    () => FamilyEntity,
    (family: FamilyEntity) => family.joinRequests,
    {
      nullable: true,
    },
  )
  requestingToJoinFamily?: FamilyEntity | null;

  @OneToOne(() => FileEntity)
  @JoinColumn()
  avatar?: FileEntity | null;
}
