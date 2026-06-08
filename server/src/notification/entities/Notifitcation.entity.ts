import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/User.entity';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.notifications)
  user: UserEntity;

  @Column()
  title: string;

  @Column()
  body: string;
}
