import { Injectable, NotFoundException } from '@nestjs/common';
import { SummaryDto } from 'src/dtos/Summary.dto';
import { IMonthlySummary } from 'src/types/MonthlySummary.interface';
import { TransactionService } from './Transaction.service';
import { Between, Repository } from 'typeorm';
import { MonthlySummaryEntity } from '../entities/MonthlySummary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfMonth, startOfMonth } from 'date-fns';

interface ISummaryService {
  sum(data: SummaryDto): Promise<IMonthlySummary>;
}

@Injectable()
export class SummaryService implements ISummaryService {
  constructor(
    @InjectRepository(MonthlySummaryEntity)
    private readonly summaryRepository: Repository<MonthlySummaryEntity>,
    private readonly transactionService: TransactionService,
  ) {}

  async sum(data: SummaryDto): Promise<IMonthlySummary> {
    const sum = await this.summaryRepository.findOne({
      where: { familyId: data.familyId, year: data.year, month: data.month },
    });

    if (sum)
      return {
        totalEarned: sum.totalEarned,
        totalSpent: sum.totalSpent,
        pnl: sum.pnl,
        topCategory: sum.topCategory,
        topSpenderId: sum.topSpenderId,
        topEarnerId: sum.topEarnerId,
      };
    const transactions = await this.transactionService.find({
      where: {
        familyId: data.familyId,
        createdAt: Between(
          startOfMonth(new Date(data.year, data.month - 1)),
          endOfMonth(new Date(data.year, data.month - 1)),
        ),
      },
    });

    if (transactions.length == 0)
      throw new NotFoundException(
        'Monthly summary creation',
        'There are no transactions in this month. You can add some, or ignore this issue.',
      );

    let totalSpent = 0;
    let totalEarned = 0;
    let pnl = 0;

    const categoryMap = new Map<string, number>();
    const spenderMap = new Map<string, number>();
    const earnerMap = new Map<string, number>();

    for (const t of transactions) {
      pnl += t.amount;

      if (t.amount < 0) {
        totalSpent += t.amount;
        spenderMap.set(t.userId, (spenderMap.get(t.userId) || 0) + t.amount);
      } else {
        totalEarned += t.amount;
        earnerMap.set(t.userId, (earnerMap.get(t.userId) || 0) + t.amount);
      }

      categoryMap.set(
        t.category,
        (categoryMap.get(t.category) || 0) + t.amount,
      );
    }

    const topCategory = [...categoryMap.entries()].sort(
      (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
    )[0]?.[0];

    const topSpenderId = spenderMap.size
      ? [...spenderMap.entries()].sort(
          (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
        )[0][0]
      : undefined;

    const topEarnerId = earnerMap.size
      ? [...earnerMap.entries()].sort(
          (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
        )[0][0]
      : undefined;

    const ret = {
      totalSpent: -totalSpent,
      totalEarned,
      topCategory,
      topSpenderId,
      topEarnerId,
      pnl,
    };

    await this.summaryRepository.insert({
      ...ret,
      familyId: data.familyId,
      month: data.month,
      year: data.year,
    });

    return ret;
  }
}
