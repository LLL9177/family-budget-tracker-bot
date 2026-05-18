import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFamilyDto } from 'src/dtos/createFamily.dto';
import { Repository } from 'typeorm';
import { FamilyEntity } from '../entities/Family.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from 'src/types/IJwtPayload.interface';
import { Roles } from 'src/auth/enums/Roles.enum';
import { AddRemoveMemberDto } from 'src/dtos/addMember.dto';
import { UserService } from '../../user/User.service';

interface IFamilyService {
  create(data: CreateFamilyDto, user: IJwtPayload): Promise<void>;
  addMember(data: AddRemoveMemberDto, ownerId: string): Promise<void>;
  getByUuid(uuid: string): Promise<FamilyEntity | null>;
  getByOwner(owner_id: string): Promise<FamilyEntity | null>;
  removeMember(member_id: string, ownerId: string): Promise<void>;
  requestToJoinFamily(userId: string, familyId: string): Promise<void>;
  getByUser(userId: string): Promise<FamilyEntity>
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
        members: [owner],
      });

      const family = await this.getByOwner(owner.id);

      if (!family)
        throw new NotFoundException(
          "This user is either not a family owner, or a family doesn't exist at all",
        );

      owner.family = family;
      owner.familyOwned = family;

      const roles = JSON.parse(owner.roles) as Roles[];
      if (!roles.includes(Roles.FAMILY_OWNER)) roles.push(Roles.FAMILY_OWNER);
      owner.roles = JSON.stringify(roles);

      await this.userService.changeUser(owner);
    } else {
      throw new UnauthorizedException();
    }
  }

  async addMember(data: AddRemoveMemberDto, ownerId: string): Promise<void> {
    const user = await this.userService.findById(data.user_id);
    if (!user) throw new NotFoundException('user not found');

    const owner = await this.userService.findById(ownerId, true);
    if (!owner) throw new UnauthorizedException();

    const family = await this.getByUuid(owner.familyOwned.id);
    if (!family) throw new NotFoundException('family not found');

    if (!family.members.includes(user)) family.members.push(user);

    user.family = family;
    await this.userService.changeUser(user);
    await this.familyRepository.save(family);
  }

  async getByUuid(uuid: string): Promise<FamilyEntity | null> {
    return await this.familyRepository.findOne({
      where: { id: uuid },
      relations: ['members'],
    });
  }

  async getByOwner(owner_id: string): Promise<FamilyEntity | null> {
    const owner = await this.userService.findById(owner_id);

    if (!owner) throw new NotFoundException("User wasn't found");

    return await this.familyRepository.findOneBy({ owner });
  }

  async removeMember(memberId: string, ownerId: string): Promise<void> {
    const owner = await this.userService.findById(ownerId, true);
    if (!owner) throw new NotFoundException('User was not found');
    if (!owner.familyOwned)
      throw new ForbiddenException('User does not own any family');

    const family = owner.familyOwned;
    const member = await this.userService.findById(memberId);

    if (!member)
      throw new NotFoundException("The user is not this family's member.");
    if (!family) throw new NotFoundException('Family not found');
    if (!family.members.includes(member))
      throw new NotFoundException('This user is not your family member');

    family.members = family.members.splice(family.members.indexOf(member));

    await this.familyRepository.save(family);
  }

  async requestToJoinFamily(userId: string, familyId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const family = await this.familyRepository.findOneBy({ id: familyId });
    if (!family) throw new NotFoundException('Family not found');

    user.requestingToJoinFamily = family;
  }

  async getByUser(userId: string): Promise<FamilyEntity> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.family) throw new NotFoundException('Family not found');

    return user.family;
  }
}
