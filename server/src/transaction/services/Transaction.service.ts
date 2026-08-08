import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/Transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/User.service';
import { ITransaction } from '../../types/ITransaction.interface';

interface ITransactionService {
  create(data: ITransaction): Promise<void>;
  findByUserId(id: string): Promise<TransactionEntity[]>;
  findByFamilyId(familyUuid: string): Promise<TransactionEntity[] | null>;
  findById(id: number): Promise<TransactionEntity>;
  editAmount(id: number, newAmount: number): Promise<TransactionEntity>;
  editCategory(id: number, newCategory: string): Promise<TransactionEntity>;
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
  ) {}

  async create(transaction: ITransaction): Promise<void> {
    if (transaction.category.length > 100)
      throw new BadRequestException('Category is too long');
    const user = await this.userService.findByTelegramId(
      transaction.telegramId,
    );
    if (!user) throw new NotFoundException('User not found');

    if (transaction.comment && transaction.comment.length > 200) {
      throw new BadRequestException('The comment is too long');
    }

    const data = {
      amount: transaction.amount,
      category: transaction.category,
      createdAt: transaction.createdAt,
      familyId: user.family.id,
      user,
      comment: transaction.comment ?? undefined,
    };

    await this.transactionRepository.insert(data);
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
      relations: { user: true },
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
    newCategory: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.findById(id);
    transaction.category = newCategory;
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
      relations: { user: true },
    });
  }

  async botGetUserTransactions(
    telegramId: bigint,
  ): Promise<TransactionEntity[] | null> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) throw new NotFoundException('User not found');

    return await this.transactionRepository.findBy({ user });
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
