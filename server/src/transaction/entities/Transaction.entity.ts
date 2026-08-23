import { CategoryEntity } from '../../category/entities/Category.entity';
import { UserEntity } from '../../user/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalCategoryEntity } from '../../category/entities/GlobalCategory.entity';

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

  @ManyToOne(() => CategoryEntity, (category) => category.transactions, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  category?: CategoryEntity;

  @JoinColumn()
  @ManyToOne(() => GlobalCategoryEntity, (category) => category.transactions, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  globalCategory?: GlobalCategoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  comment?: string;
}
