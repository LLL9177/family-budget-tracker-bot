import { UserEntity } from 'src/user/entities/User.entity';
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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  owner: UserEntity;
}
