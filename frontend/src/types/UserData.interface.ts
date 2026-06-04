import type { RolesEnum } from "@/enums/RolesEnum";
import type { IFamily } from "./Family.interface";

export interface IUserData {
  id: string;
  username: string;
  avatar: { url: string };
  family: IFamily;
  familyOwned?: { id: string } | null;
  email: string;
  roles: RolesEnum[];
}
