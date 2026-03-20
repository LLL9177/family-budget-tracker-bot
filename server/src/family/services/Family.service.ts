import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFamilyDto } from 'src/dtos/createFamily.dto';
import { Repository } from 'typeorm';
import { FamilyEntity } from '../entities/Family.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/User.service';
import { IJwtPayload } from 'src/types/IJwtPayload.interface';
import { Roles } from 'src/auth/enums/Roles.enum';
import { AddRemoveMemberDto } from 'src/dtos/addMember.dto';

interface IFamilyService {
  create(data: CreateFamilyDto, user: IJwtPayload): Promise<void>;
  addMember(data: AddRemoveMemberDto): Promise<void>;
  getByUuid(uuid: string): Promise<FamilyEntity | null>;
  getByOwner(owner_id: string): Promise<FamilyEntity | null>;
  removeMember(member_id: string, family_id: string): Promise<void>;
}

@Injectable()
export class FamilyService implements IFamilyService {
  constructor(
    @InjectRepository(FamilyEntity)
    private readonly familyRepository: Repository<FamilyEntity>,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateFamilyDto, user: IJwtPayload): Promise<void> {
    const owner = await this.userService.findById(user.id);
    if (owner) {
      await this.familyRepository.insert({
        name: data.name,
        owner: owner,
        members: `[${user.id}]`,
      });

      const family = await this.getByOwner(owner.id);

      if (!family)
        throw new NotFoundException(
          "This user is either not a family owner, or a family doesn't exist at all",
        );

      owner.family = family.id;
      owner.family_owned = family.id;

      const roles = JSON.parse(owner.roles) as Roles[];
      roles.push(Roles.FAMILY_OWNER);
      owner.roles = JSON.stringify(roles);

      await this.userService.changeUser(owner);
    } else {
      throw new UnauthorizedException();
    }
  }

  async addMember(data: AddRemoveMemberDto): Promise<void> {
    const user = await this.userService.findById(data.user_id);
    if (!user) throw new NotFoundException('user not found');

    const family = await this.familyRepository.findOneBy({
      id: data.family_uuid,
    });
    if (!family) throw new NotFoundException('family not found');

    const members = JSON.parse(family.members) as unknown[];
    if (!members.includes(data.user_id)) members.push(data.user_id);

    family.members = JSON.stringify(members);
    user.family = family.id;
    await this.userService.changeUser(user);
    await this.familyRepository.save(family);
  }

  async getByUuid(uuid: string): Promise<FamilyEntity | null> {
    return await this.familyRepository.findOneBy({ id: uuid });
  }

  async getByOwner(owner_id: string): Promise<FamilyEntity | null> {
    const owner = await this.userService.findById(owner_id);

    if (!owner) throw new NotFoundException("User wasn't found");

    return await this.familyRepository.findOneBy({ owner });
  }

  async removeMember(member_id: string, family_uuid: string): Promise<void> {
    const family = await this.getByUuid(family_uuid);

    if (!family) throw new NotFoundException('Family not found');

    const members = JSON.parse(family.members) as string[];
    family.members = JSON.stringify(members.splice(members.indexOf(member_id)));

    await this.familyRepository.save(family);
  }
}
