import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'uuid' })
  familyId: string;

  @Column()
  amount: number; // how much you earned. If you spent, it should be negative.

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
