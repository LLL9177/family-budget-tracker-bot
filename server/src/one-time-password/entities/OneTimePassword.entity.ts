import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['userId'], { unique: true, where: '"userId" IS NOT NULL' })
export class OneTimePasswordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  password: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'date' })
  expiresAt: Date;
}
