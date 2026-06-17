import { FamilyEntity } from 'src/family/entities/Family.entity';
import { UserEntity } from 'src/user/entities/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  mostSpentOn: string;

  @Column({ nullable: true })
  mostEarnedFrom: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  topSpender: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  topEarner: UserEntity;
}
