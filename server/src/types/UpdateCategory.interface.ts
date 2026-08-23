import { CategoryUsedInEnum } from 'src/enums/CategoryUserIn.enum';

export interface IUpdateCategory {
  id: string;
  eng?: string;
  ukr?: string;
  usedIn: CategoryUsedInEnum;
}
