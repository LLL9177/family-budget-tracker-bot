import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/Transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/User.service';
import { ITransaction } from '../../types/ITransaction.interface';
import { CategoryService } from 'src/category/services/Category.service';
import { GlobalCategoryService } from 'src/category/services/GlobalCategory.service';
import { CategoryUsedInEnum } from 'src/enums/CategoryUserIn.enum';
import { CategoryTypeEnum } from 'src/enums/CategoryType.enum';

interface ITransactionService {
  create(data: ITransaction): Promise<void>;
  findByUserId(id: string): Promise<TransactionEntity[]>;
  findByFamilyId(familyUuid: string): Promise<TransactionEntity[] | null>;
  findById(id: number): Promise<TransactionEntity>;
  editAmount(id: number, newAmount: number): Promise<TransactionEntity>;
  editCategory(
    id: number,
    newCategory: string,
    type: CategoryTypeEnum,
  ): Promise<TransactionEntity>;
  delete(id: number): Promise<void>;
  find(data): Promise<TransactionEntity[]>;
  botGetFamilyTransactions(
    telegramId: bigint,
  ): Promise<TransactionEntity[] | null>;
  botGetUserTransactions(
    telegramId: bigint,
  ): Promise<TransactionEntity[] | null>;
  editComment(id: number, comment: string): Promise<void>;
}

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly globalCategoryService: GlobalCategoryService,
  ) {}

  async create(transaction: ITransaction): Promise<void> {
    const user = await this.userService.findByTelegramId(
      transaction.telegramId,
    );
    if (!user) throw new NotFoundException('User not found');

    if (transaction.comment && transaction.comment.length > 200) {
      throw new BadRequestException('The comment is too long');
    }

    const isGlobal = await this.globalCategoryService.check(
      transaction.category,
    );

    if (!isGlobal) {
      const category = await this.categoryService.findById(
        transaction.category,
      );

      const data = {
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        familyId: user.family.id,
        user,
        comment: transaction.comment ?? undefined,
        category,
      };

      await this.transactionRepository.save(data);
    } else {
      const category = await this.globalCategoryService.findById(
        transaction.category,
      );

      const data = {
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        familyId: user.family.id,
        user,
        comment: transaction.comment ?? undefined,
        globalCategory: category,
      };

      await this.transactionRepository.save(data);
    }
  }

  async findByUserId(id: string): Promise<TransactionEntity[]> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return await this.transactionRepository.findBy({ user });
  }

  async findByFamilyId(
    familyUuid: string,
  ): Promise<TransactionEntity[] | null> {
    return await this.transactionRepository.find({
      where: { familyId: familyUuid },
      relations: { user: true, category: true, globalCategory: true },
    });
  }

  async findById(id: number): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }

  async editAmount(id: number, newAmount: number): Promise<TransactionEntity> {
    const transaction = await this.findById(id);
    transaction.amount = newAmount;
    return await this.transactionRepository.save(transaction);
  }

  async editCategory(
    id: number,
    newCategory: string, // id
    type: CategoryTypeEnum,
  ): Promise<TransactionEntity> {
    const transaction = await this.findById(id);

    if (type == CategoryTypeEnum.LOCAL) {
      transaction.category = await this.categoryService.findById(newCategory);
    } else {
      transaction.globalCategory =
        await this.globalCategoryService.findById(newCategory);
    }

    return await this.transactionRepository.save(transaction);
  }

  async delete(id: number): Promise<void> {
    await this.transactionRepository.delete({ id });
  }

  // what is this?
  async find(data: any): Promise<TransactionEntity[]> {
    return await this.transactionRepository.find(data);
  }

  async botGetFamilyTransactions(
    telegramId: bigint,
  ): Promise<TransactionEntity[] | null> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) throw new NotFoundException('User not found');

    return await this.transactionRepository.find({
      where: {
        familyId: user.family.id,
      },
      relations: { user: true, category: true, globalCategory: true },
    });
  }

  async botGetUserTransactions(
    telegramId: bigint,
  ): Promise<TransactionEntity[] | null> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) throw new NotFoundException('User not found');

    return await this.transactionRepository.find({
      where: { user },
      relations: { category: true, globalCategory: true },
    });
  }

  async editComment(id: number, comment: string): Promise<void> {
    if (comment.length > 200) {
      throw new BadRequestException('The comment is too long');
    }

    const transaction = await this.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.comment = comment;
    await this.transactionRepository.save(transaction);
  }
}
