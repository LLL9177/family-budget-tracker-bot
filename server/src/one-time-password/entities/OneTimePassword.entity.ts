import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
