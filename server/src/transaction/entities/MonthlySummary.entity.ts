import { CategoryEntity } from '../../category/entities/Category.entity';
import { FamilyEntity } from '../../family/entities/Family.entity';
import { UserEntity } from '../../user/entities/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalCategoryEntity } from '../../category/entities/GlobalCategory.entity';

@Entity()
export class MonthlySummaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FamilyEntity)
  @JoinColumn()
  family: FamilyEntity;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column()
  totalSpent: number;

  @Column()
  totalEarned: number;

  @Column()
  pnl: number;

  @JoinColumn()
  @OneToOne(() => CategoryEntity)
  mostSpentOn: CategoryEntity;

  @JoinColumn()
  @OneToOne(() => GlobalCategoryEntity)
  mostSpentOnGlobal: GlobalCategoryEntity;

  @JoinColumn()
  @OneToOne(() => CategoryEntity)
  mostEarnedFrom: CategoryEntity;

  @JoinColumn()
  @OneToOne(() => GlobalCategoryEntity)
  mostEarnedFromGlobal: GlobalCategoryEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  topSpender: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  topEarner: UserEntity;
}
