import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MonthlySummaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  familyId: string;

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

  @Column({ type: 'uuid', nullable: true })
  topSpenderId: string;

  @Column({ type: 'uuid', nullable: true })
  topEarnerId: string;
}
