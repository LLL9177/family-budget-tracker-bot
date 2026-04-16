import { FamilyEntity } from 'src/family/entities/Family.entity';
import { UserEntity } from 'src/user/entities/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MonthlySummaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FamilyEntity)
  @JoinColumn()
  family: FamilyEntity;

  // Did bro forget that Date type is absolutelly writable here? I'll ignore that.
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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  topSpender: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  topEarner: UserEntity;
}
