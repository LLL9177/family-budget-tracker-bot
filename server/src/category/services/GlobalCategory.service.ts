import { InjectRepository } from '@nestjs/typeorm';
import { GlobalCategoryEntity } from '../entities/GlobalCategory.entity';
import { Repository } from 'typeorm';
import { CategoryUsedInEnum } from 'src/enums/CategoryUserIn.enum';
import { FamilyService } from 'src/family/services/Family.service';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';

interface IGlobalCategoryService {
  createAll(): Promise<void>;
  connectFamily(familyId: string): Promise<void>;
  check(id: string): Promise<boolean>;
  findById(id: string): Promise<GlobalCategoryEntity>;
  findByName(name: string): Promise<GlobalCategoryEntity>;
  getAll(): Promise<GlobalCategoryEntity[]>;
}

export class GlobalCategoryService implements IGlobalCategoryService {
  constructor(
    @InjectRepository(GlobalCategoryEntity)
    private readonly repository: Repository<GlobalCategoryEntity>,
    @Inject(forwardRef(() => FamilyService))
    private readonly familyService: FamilyService,
  ) {}

  async createAll(): Promise<void> {
    const categories: Partial<GlobalCategoryEntity>[] = [
      { eng: '💼 Job', ukr: '💼 Робота', usedIn: CategoryUsedInEnum.EARNING },
      {
        eng: '💳 Credit',
        ukr: '💳 Кредит',
        usedIn: CategoryUsedInEnum.EARNING,
      },
      { eng: '📦 Other', ukr: '📦 Інше', usedIn: CategoryUsedInEnum.BOTH },

      {
        eng: '🛒 Groceries',
        ukr: '🛒 Продукти',
        usedIn: CategoryUsedInEnum.PAYMENT,
      },
      {
        eng: '🧾 Taxes',
        ukr: '🧾 Податки',
        usedIn: CategoryUsedInEnum.PAYMENT,
      },
      { eng: '⚠️ Fine', ukr: '⚠️ Штраф', usedIn: CategoryUsedInEnum.PAYMENT },
      { eng: '💻 Tech', ukr: '💻 Техніка', usedIn: CategoryUsedInEnum.PAYMENT },

      {
        eng: '🌐 Online subscriptions',
        ukr: '🌐 Онлайн підписки',
        usedIn: CategoryUsedInEnum.PAYMENT,
      },

      {
        eng: '🛍️ Shopping',
        ukr: '🛍️ Покупки',
        usedIn: CategoryUsedInEnum.PAYMENT,
      },
      {
        eng: '❤️ Health',
        ukr: "❤️ Здоров'я",
        usedIn: CategoryUsedInEnum.PAYMENT,
      },
      { eng: '💅 Beauty', ukr: '💅 Краса', usedIn: CategoryUsedInEnum.PAYMENT },
      {
        eng: '🎉 Parties',
        ukr: '🎉 Вечірки',
        usedIn: CategoryUsedInEnum.PAYMENT,
      },
      {
        eng: '🎁 Presents',
        ukr: '🎁 Подарунки',
        usedIn: CategoryUsedInEnum.PAYMENT,
      },
    ];

    for (const category of categories) {
      const exists = await this.repository.exists({
        where: {
          eng: category.eng,
          ukr: category.ukr,
          usedIn: category.usedIn,
        },
      });

      if (!exists) {
        await this.repository.save(category);
      }
    }
  }

  async connectFamily(familyId: string): Promise<void> {
    const family = await this.familyService.getByUuid(familyId);
    if (!family) throw new NotFoundException('Family not found');

    await this.createAll();
    const categories = await this.repository.find();

    for (const category of categories) {
      category.families.push(family);
      await this.repository.save(category);
    }
  }

  async check(id: string): Promise<boolean> {
    const category = await this.repository.findOneBy({ id });

    return category !== null;
  }

  async findById(id: string): Promise<GlobalCategoryEntity> {
    const category = await this.repository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async findByName(name: string): Promise<GlobalCategoryEntity> {
    await this.createAll();

    const forEn = await this.repository.findOneBy({ eng: name });
    const forUkr = await this.repository.findOneBy({ ukr: name });

    if (!forEn && !forUkr) throw new NotFoundException('Category not found');

    return forEn ?? forUkr!;
  }

  async getAll(): Promise<GlobalCategoryEntity[]> {
    await this.createAll();
    return await this.repository.find();
  }
}
