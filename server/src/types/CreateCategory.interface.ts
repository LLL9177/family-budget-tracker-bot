import { CategoryUsedInEnum } from 'src/enums/CategoryUserIn.enum';

export interface ICreacteCategory {
  userId: bigint;
  eng?: string;
  ukr?: string;
  usedIn: CategoryUsedInEnum;
}
