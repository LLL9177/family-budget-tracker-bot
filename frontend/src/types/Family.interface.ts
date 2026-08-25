import type { ICategory } from "./Category.interface";
import type { IUserData } from "./UserData.interface";

export interface IFamily {
  id: string;
  name: string;
  members: IUserData[];
  owner: IUserData;
  joinRequests: IUserData[];
  avatar: {
    id: string;
    url: string;
  };
  banner: {
    id: string;
    url: string;
  };
  categories: ICategory[];
  globalCategories: ICategory[];
}
