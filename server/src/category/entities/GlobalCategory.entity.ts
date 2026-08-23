import { TransactionEntity } from '../../transaction/entities/Transaction.entity';
import { CategoryTypeEnum } from '../../enums/CategoryType.enum';
import { CategoryUsedInEnum } from '../../enums/CategoryUserIn.enum';
import { FamilyEntity } from '../../family/entities/Family.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GlobalCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eng: string;

  @Column()
  ukr: string;

  @Column({ enum: CategoryUsedInEnum })
  usedIn: CategoryUsedInEnum;

  @ManyToMany(() => FamilyEntity, (families) => families.globalCategories)
  families: FamilyEntity[];

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.globalCategory,
  )
  transactions: TransactionEntity;

  @Column({
    enum: CategoryTypeEnum,
    default: CategoryTypeEnum.GLOBAL,
    update: false,
  })
  type: CategoryTypeEnum;
}
