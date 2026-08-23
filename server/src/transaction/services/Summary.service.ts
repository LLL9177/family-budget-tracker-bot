import { Injectable, NotFoundException } from '@nestjs/common';
import { SummaryDto } from 'src/dtos/Summary.dto';
import { IMonthlySummary } from 'src/types/MonthlySummary.interface';
import { TransactionService } from './Transaction.service';
import { Between, Repository } from 'typeorm';
import { MonthlySummaryEntity } from '../entities/MonthlySummary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfMonth, startOfMonth } from 'date-fns';
import { FamilyService } from '../../family/services/Family.service';
import { UserEntity } from 'src/user/entities/User.entity';
import { CategoryEntity } from 'src/category/entities/Category.entity';
import { GlobalCategoryEntity } from 'src/category/entities/GlobalCategory.entity';

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

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    const sum = await this.summaryRepository.findOne({
      where: {
        family,
        year: data.year,
        month: data.month,
      },
      relations: {
        mostSpentOn: true,
        mostSpentOnGlobal: true,
        mostEarnedFrom: true,
        mostEarnedFromGlobal: true,
        topSpender: true,
        topEarner: true,
      },
    });

    if (sum) {
      return {
        totalEarned: sum.totalEarned,
        totalSpent: sum.totalSpent,
        pnl: sum.pnl,
        mostSpentOn: sum.mostSpentOn,
        mostSpentOnGlobal: sum.mostSpentOnGlobal,
        mostEarnedFrom: sum.mostEarnedFrom,
        mostEarnedFromGlobal: sum.mostEarnedFromGlobal,
        topSpender: sum.topSpender,
        topEarner: sum.topEarner,
      };
    }

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
        category: true,
        globalCategory: true,
      },
    });

    if (transactions.length === 0) {
      throw new NotFoundException(
        'There are no transactions in this month. You can add some, or ignore this issue.',
      );
    }

    let totalSpent = 0;
    let totalEarned = 0;
    let pnl = 0;

    const spenderMap = new Map<string, number>();
    const earnerMap = new Map<string, number>();

    const categorySpentMap = new Map<string, number>();
    const globalCategorySpentMap = new Map<string, number>();

    const categoryEarnedMap = new Map<string, number>();
    const globalCategoryEarnedMap = new Map<string, number>();

    const users = new Map<string, UserEntity>();
    const categories = new Map<string, CategoryEntity>();
    const globalCategories = new Map<string, GlobalCategoryEntity>();

    for (const t of transactions) {
      pnl += t.amount;

      users.set(t.user.id, t.user);

      if (t.category) {
        categories.set(t.category.id, t.category);
      }

      if (t.globalCategory) {
        globalCategories.set(t.globalCategory.id, t.globalCategory);
      }

      if (t.amount < 0) {
        const spent = Math.abs(t.amount);

        totalSpent += spent;

        spenderMap.set(t.user.id, (spenderMap.get(t.user.id) ?? 0) + spent);

        if (t.category) {
          categorySpentMap.set(
            t.category.id,
            (categorySpentMap.get(t.category.id) ?? 0) + spent,
          );
        }

        if (t.globalCategory) {
          globalCategorySpentMap.set(
            t.globalCategory.id,
            (globalCategorySpentMap.get(t.globalCategory.id) ?? 0) + spent,
          );
        }
      } else {
        const earned = t.amount;

        totalEarned += earned;

        earnerMap.set(t.user.id, (earnerMap.get(t.user.id) ?? 0) + earned);

        if (t.category) {
          categoryEarnedMap.set(
            t.category.id,
            (categoryEarnedMap.get(t.category.id) ?? 0) + earned,
          );
        }

        if (t.globalCategory) {
          globalCategoryEarnedMap.set(
            t.globalCategory.id,
            (globalCategoryEarnedMap.get(t.globalCategory.id) ?? 0) + earned,
          );
        }
      }
    }

    const getTopId = (map: Map<string, number>) => {
      return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    };

    const topSpenderId = getTopId(spenderMap);
    const topEarnerId = getTopId(earnerMap);

    const mostSpentOnId = getTopId(categorySpentMap);
    const mostSpentOnGlobalId = getTopId(globalCategorySpentMap);

    const mostEarnedFromId = getTopId(categoryEarnedMap);
    const mostEarnedFromGlobalId = getTopId(globalCategoryEarnedMap);

    const ret = {
      totalSpent: -totalSpent,
      totalEarned,
      pnl,

      mostSpentOn:
        mostSpentOnId !== undefined ? categories.get(mostSpentOnId) : undefined,

      mostSpentOnGlobal:
        mostSpentOnGlobalId !== undefined
          ? globalCategories.get(mostSpentOnGlobalId)
          : undefined,

      mostEarnedFrom:
        mostEarnedFromId !== undefined
          ? categories.get(mostEarnedFromId)
          : undefined,

      mostEarnedFromGlobal:
        mostEarnedFromGlobalId !== undefined
          ? globalCategories.get(mostEarnedFromGlobalId)
          : undefined,

      topSpender:
        topSpenderId !== undefined ? users.get(topSpenderId) : undefined,

      topEarner: topEarnerId !== undefined ? users.get(topEarnerId) : undefined,
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
