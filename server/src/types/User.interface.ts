import { FamilyEntity } from 'src/family/entities/Family.entity';

export interface IUser {
  username: string;
  family?: FamilyEntity;
  familyOwned?: FamilyEntity;
  email: string;
  roles: string;
  googleId?: string;
}
