import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/Transaction.entity';
import { Repository } from 'typeorm';
import { ITransaction } from 'src/types/ITransaction.interface';

interface ITransactionService {
  create(data: ITransaction): Promise<void>;
  findByUserId(id: string): Promise<TransactionEntity[]>;
  findByFamilyId(familyUuid: string): Promise<TransactionEntity[]>;
  findById(id: number): Promise<TransactionEntity>;
  editAmount(id: number, newAmount: number): Promise<TransactionEntity>;
  editCategory(id: number, newCategory: string): Promise<TransactionEntity>;
  delete(id: number): Promise<void>;
  find(data): Promise<TransactionEntity[]>;
}

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(data: ITransaction): Promise<void> {
    await this.transactionRepository.insert(data);
  }

  async findByUserId(id: string): Promise<TransactionEntity[]> {
    return await this.transactionRepository.findBy({ userId: id });
  }

  async findByFamilyId(familyUuid: string): Promise<TransactionEntity[]> {
    return await this.transactionRepository.findBy({ familyId: familyUuid });
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

  async find(data: any): Promise<TransactionEntity[]> {
    return await this.transactionRepository.find(data);
  }
}
