import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MonthlySummaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  familyId: string;

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

  @Column()
  topCategory: string;

  @Column({ type: 'uuid', nullable: true })
  topSpenderId: string;

  @Column({ type: 'uuid', nullable: true })
  topEarnerId: string;
}
