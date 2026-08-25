import type { CategoryTypeEnum } from "@/enums/CategoryType.enum";
import type { CategoryUsedInEnum } from "@/enums/CategoryUserIn.enum";

export interface ICategory {
  id: string;
  eng: string;
  ukr: string;
  usedIn: CategoryUsedInEnum;
  type: CategoryTypeEnum;
}
