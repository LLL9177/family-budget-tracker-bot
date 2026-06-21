import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/User.entity';
import { IconEnum } from '../../enums/Icon.enum';
import { NotificationKeyEnum } from '../../enums/NotificationKey.enum';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.notifications)
  user: UserEntity;

  @Column({ enum: NotificationKeyEnum })
  key: NotificationKeyEnum;

  @Column({ type: 'simple-json', nullable: true })
  meta?: Record<string, string>;

  @Column({ enum: IconEnum })
  icon: IconEnum;
}
