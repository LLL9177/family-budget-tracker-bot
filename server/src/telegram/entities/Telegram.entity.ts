import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/User.entity';

@Entity()
export class TelegramEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  telegramUsername: string;

  @Column({ type: 'bigint' })
  telegramId: bigint;

  @ManyToOne(() => UserEntity, (user) => user.telegramRequests)
  user: UserEntity;

  @Column({ type: 'bigint' })
  chatId: bigint;

  @Column()
  lang: 'en' | 'uk';

  @Column({ type: 'date' })
  expiresAt: Date;
}
