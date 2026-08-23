import { CategoryTypeEnum } from '../../enums/CategoryType.enum';
import { CategoryUsedInEnum } from '../../enums/CategoryUserIn.enum';
import { FamilyEntity } from '../../family/entities/Family.entity';
import { TransactionEntity } from '../../transaction/entities/Transaction.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  eng?: string;

  @Column({ nullable: true })
  ukr?: string;

  @Column({ enum: CategoryUsedInEnum })
  usedIn: CategoryUsedInEnum;

  @ManyToOne(() => FamilyEntity, (family) => family.categories)
  @JoinColumn()
  family: FamilyEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions: TransactionEntity[];

  @Column({
    enum: CategoryTypeEnum,
    default: CategoryTypeEnum.LOCAL,
    update: false,
  })
  type: CategoryTypeEnum;
}
