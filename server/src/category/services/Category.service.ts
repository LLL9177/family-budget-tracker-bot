import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/Category.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ICreacteCategory } from 'src/types/CreateCategory.interface';
import { IUpdateCategory } from 'src/types/UpdateCategory.interface';
import { FamilyService } from 'src/family/services/Family.service';
import { GlobalCategoryService } from './GlobalCategory.service';
import { GlobalCategoryEntity } from '../entities/GlobalCategory.entity';
import { UserService } from 'src/user/User.service';

interface ICategoryService {
  create(data: ICreacteCategory): Promise<string | void>;
  update(data: IUpdateCategory): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<CategoryEntity>;
  findByUserTg(
    userTelegramId: bigint,
  ): Promise<(CategoryEntity | GlobalCategoryEntity)[]>;
}

export class CategoryService implements ICategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => FamilyService))
    private readonly familyService: FamilyService,
    private readonly globalCategoryService: GlobalCategoryService,
    private readonly userService: UserService,
  ) {}

  async create(data: ICreacteCategory): Promise<string | void> {
    if (!data.eng && !data.ukr)
      throw new BadRequestException(
        'One of English or Ukrainian versions must be specified',
      );

    const user = await this.userService.findByTelegramId(data.userId);
    if (!user) throw new NotFoundException('User not found');

    const family = await this.familyService.getByUser(user.id);

    const categories = await this.repository.find({
      where: {
        family,
      },
    });

    for (const category of categories) {
      if (category.eng == data.eng || category.ukr == data.ukr) {
        await this.update({
          id: category.id,
          usedIn: category.usedIn,
          eng: data.eng || category.eng,
          ukr: data.ukr || category.ukr,
        });

        return;
      }
    }

    return (
      await this.repository.save({
        family,
        eng: data.eng || data.ukr,
        ukr: data.ukr || data.eng,
        usedIn: data.usedIn,
      })
    ).id;
  }

  async update(data: IUpdateCategory): Promise<void> {
    if (!data.eng && !data.ukr)
      throw new BadRequestException(
        'One of English or Ukrainian versions must be specified',
      );

    await this.repository.save({
      id: data.id,
      eng: data.eng || undefined,
      ukr: data.ukr || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async findById(id: string): Promise<CategoryEntity> {
    const category = await this.repository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async findByUserTg(
    userTelegramId: bigint,
  ): Promise<(CategoryEntity | GlobalCategoryEntity)[]> {
    const user = await this.userService.findByTelegramId(userTelegramId);
    if (!user) throw new NotFoundException('User not found');

    const family = await this.familyService.getByUser(user.id);

    const familyCategories = await this.repository.findBy({ family });
    const globalCategories = await this.globalCategoryService.getAll();

    return [...globalCategories, ...familyCategories];
  }
}
