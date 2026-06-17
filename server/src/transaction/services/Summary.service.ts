import { Injectable, NotFoundException } from '@nestjs/common';
import { SummaryDto } from 'src/dtos/Summary.dto';
import { IMonthlySummary } from 'src/types/MonthlySummary.interface';
import { TransactionService } from './Transaction.service';
import { Between, Repository } from 'typeorm';
import { MonthlySummaryEntity } from '../entities/MonthlySummary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfMonth, startOfMonth } from 'date-fns';
import { FamilyService } from '../../family/services/Family.service';

interface ISummaryService {
  sum(data: SummaryDto): Promise<IMonthlySummary>;
}

@Injectable()
export class SummaryService implements ISummaryService {
  constructor(
    @InjectRepository(MonthlySummaryEntity)
    private readonly summaryRepository: Repository<MonthlySummaryEntity>,
    private readonly transactionService: TransactionService,
    private readonly familyService: FamilyService,
  ) {}

  async sum(data: SummaryDto): Promise<IMonthlySummary> {
    const family = await this.familyService.getByUuid(data.familyId);
    if (!family) throw new NotFoundException('Family not found');
    const sum = await this.summaryRepository.findOne({
      where: { family, year: data.year, month: data.month },
    });

    if (sum)
      return {
        totalEarned: sum.totalEarned,
        totalSpent: sum.totalSpent,
        pnl: sum.pnl,
        mostSpentOn: sum.mostSpentOn,
        mostEarnedFrom: sum.mostEarnedFrom,
        topSpender: sum.topSpender,
        topEarner: sum.topEarner,
      };
    const transactions = await this.transactionService.find({
      where: {
        familyId: data.familyId,
        createdAt: Between(
          startOfMonth(new Date(data.year, data.month - 1)),
          endOfMonth(new Date(data.year, data.month - 1)),
        ),
      },
      relations: {
        user: true,
      },
    });

    if (transactions.length == 0)
      throw new NotFoundException(
        'There are no transactions in this month. You can add some, or ignore this issue.',
      );

    let totalSpent = 0;
    let totalEarned = 0;
    let pnl = 0;

    const spenderMap = new Map<string, number>();
    const earnerMap = new Map<string, number>();
    const categorySpentMap = new Map<string, number>();
    const categoryEarnedMap = new Map<string, number>();

    for (const t of transactions) {
      const userId = t.user.id;

      pnl += t.amount;

      if (t.amount < 0) {
        const spent = Math.abs(t.amount);
        totalSpent += spent;

        spenderMap.set(userId, (spenderMap.get(userId) || 0) + spent);
        categorySpentMap.set(
          t.category,
          (categorySpentMap.get(t.category) || 0) + spent,
        );
      } else {
        const earned = t.amount;
        totalEarned += earned;

        earnerMap.set(userId, (earnerMap.get(userId) || 0) + earned);
        categoryEarnedMap.set(
          t.category,
          (categoryEarnedMap.get(t.category) || 0) + earned,
        );
      }
    }

    const mostSpentOn = [...categorySpentMap.entries()].sort(
      (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
    )[0]?.[0];

    const mostEarnedFrom = [...categoryEarnedMap.entries()].sort(
      (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
    )[0]?.[0];

    const topSpender = spenderMap.size
      ? [...spenderMap.entries()].sort((a, b) => b[1] - a[1])[0][0]
      : undefined;

    const topEarner = earnerMap.size
      ? [...earnerMap.entries()].sort(
          (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
        )[0][0]
      : undefined;

    const ret = {
      totalSpent: -totalSpent,
      totalEarned,
      mostSpentOn,
      mostEarnedFrom,
      topSpender: family.members.find((user) => user.id == topSpender),
      topEarner: family.members.find((user) => user.id == topEarner),
      pnl,
    };

    await this.summaryRepository.insert({
      ...ret,
      family,
      month: data.month,
      year: data.year,
    });

    return ret;
  }
}
