import { UserEntity } from '../../user/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'uuid' })
  familyId: string;

  @Column()
  amount: number; // how much you earned. If you spent, it should be negative.

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
