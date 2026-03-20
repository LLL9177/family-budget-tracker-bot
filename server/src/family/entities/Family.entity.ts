import { UserEntity } from 'src/user/entities/User.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FamilyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '[]' })
  members: string;

  @ManyToOne(() => UserEntity, (user: { id: string }) => user.id)
  owner: UserEntity;
}
