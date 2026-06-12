import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/User.entity';

@Entity()
export class TelegramEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  telegramUsername: string;

  @Column()
  telegramId: number;

  @ManyToOne(() => UserEntity, (user) => user.telegramRequests)
  user: UserEntity;
}
