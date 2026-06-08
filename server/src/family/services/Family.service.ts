import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { FamilyEntity } from '../entities/Family.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/auth/enums/Roles.enum';
import { AddRemoveMemberDto } from 'src/dtos/addMember.dto';
import { UserService } from '../../user/User.service';
import { FileService } from '../../file/services/File.service';
import { FileTypeEnum } from '../../enums/FileType.enum';
import { IJwtPayload } from '../../types/IJwtPayload.interface';
import { CreateFamilyDto } from '../../dtos/createFamily.dto';
import { NotificationService } from '../../notification/services/Notification.service';

interface IFamilyService {
  create(data: CreateFamilyDto, user: IJwtPayload): Promise<void>;
  addMember(data: AddRemoveMemberDto, ownerId: string): Promise<void>;
  getByUuid(uuid: string): Promise<FamilyEntity | null>;
  getByOwner(owner_id: string): Promise<FamilyEntity | null>;
  removeMember(member_id: string, ownerId: string): Promise<void>;
  requestToJoinFamily(userId: string, familyId: string): Promise<void>;
  getByUser(userId: string): Promise<FamilyEntity>;
  acceptJoinFamily(userId: string, ownerId: string): Promise<void>;
  rejectJoinFamily(userId: string, ownerId: string): Promise<void>;
  uploadBanner(file: Express.Multer.File, userId: string): Promise<void>;
  uploadAvatar(file: Express.Multer.File, userId: string): Promise<void>;
}

@Injectable()
export class FamilyService implements IFamilyService {
  constructor(
    @InjectRepository(FamilyEntity)
    private readonly familyRepository: Repository<FamilyEntity>,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(data: CreateFamilyDto, user: IJwtPayload): Promise<void> {
    if (data.name.length > 60) throw new BadRequestException('Name is too big');
    const owner = await this.userService.findById(user.id);
    if (owner) {
      if (!process.env.DEFAULT_FAMILY_BANNER)
        throw new Error('App misconfigured');
      const banner = await this.fileService.getByUrl(
        process.env.DEFAULT_FAMILY_BANNER,
      );
      await this.familyRepository.save({
        name: data.name,
        owner: owner,
        members: [owner],
        banner,
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
    const family = await this.familyRepository.findOne({
      where: { id: uuid },
      relations: {
        members: {
          avatar: true,
        },
        banner: true,
        avatar: true,
        owner: {
          avatar: true,
        },
        joinRequests: true,
      },
    });

    if (!family) throw new NotFoundException('Family not found');

    return family;
  }

  async getByOwner(owner_id: string): Promise<FamilyEntity | null> {
    const owner = await this.userService.findById(owner_id);

    if (!owner) throw new NotFoundException("User wasn't found");

    const family = await this.familyRepository.findOne({
      where: { owner },
      relations: ['banner', 'avatar'],
    });
    if (!family) throw new NotFoundException('Family not found');

    return family;
  }

  async removeMember(memberId: string, ownerId: string): Promise<void> {
    const owner = await this.userService.findById(ownerId, true);
    if (!owner) throw new NotFoundException('User was not found');
    if (!owner.familyOwned)
      throw new ForbiddenException('User does not own any family');

    const family = await this.familyRepository.findOne({
      where: { owner },
      relations: {
        members: true,
      },
    });
    const member = await this.userService.findById(memberId);

    if (!member)
      throw new NotFoundException("The user is not this family's member.");
    if (!family) throw new NotFoundException('Family not found');
    const index = family.members.findIndex((member) => member.id == memberId);
    if (index == -1)
      throw new NotFoundException('This user is not your family member');

    family.members.splice(index, 1);

    await this.notificationService.create(
      {
        title: `You've been kicked out of ${family.name}`,
        body: '',
      },
      member.id,
    );

    for (const user of family.members) {
      if (user.id == owner.id) continue;
      await this.notificationService.create(
        {
          title: `Say bye-bye to ${member.username}`,
          body: `${member.username} has been kicked out of the family`,
        },
        user.id,
      );
    }

    await this.familyRepository.save(family);
  }

  async requestToJoinFamily(userId: string, familyId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      relations: { owner: { notifications: true } },
    });
    if (!family) throw new NotFoundException('Family not found');

    user.requestingToJoinFamily = family;
    if (family.joinRequests) {
      family.joinRequests.push(user);
    } else {
      family.joinRequests = [user];
    }

    await this.notificationService.create(
      {
        title: 'User tries to join your family',
        body: `User ${user.username} has sent a request to join your family. Open the family page to review it.`,
      },
      family.owner.id,
    );

    await this.userService.changeUser(user);
    await this.familyRepository.save(family);
  }

  async getByUser(userId: string): Promise<FamilyEntity> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.family) throw new NotFoundException('Family not found');

    const family = user.family;

    return family;
  }

  async acceptJoinFamily(userId: string, ownerId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const owner = await this.userService.findById(ownerId);
    if (!owner) throw new NotFoundException('User not found');
    const family = await this.familyRepository.findOne({
      where: { owner },
      relations: {
        joinRequests: true,
        members: true,
        owner: { notifications: true },
      },
    });
    if (!family) throw new NotFoundException('Family not found');

    const i = family.joinRequests.findIndex((u) => u.id === user.id);
    family.joinRequests.splice(i, 1);
    user.requestingToJoinFamily = null;

    // someone's gotta patch these message texts at some point
    await this.notificationService.create(
      {
        title: `Welcome to ${family.name}!`,
        body: `The family owner, ${family.owner.username}, has accepted your join request. Have a productive time!`,
      },
      user.id,
    );

    for (const member of family.members) {
      if (member.id == family.owner.id) continue;
      await this.notificationService.create(
        {
          title: 'Say hello to your new family member!',
          body: `${user.username} has joined the family.`,
        },
        member.id,
      );
    }

    family.members.push(user);

    await this.userService.changeUser(user);
    await this.familyRepository.save(family);
  }

  async uploadBanner(file: Express.Multer.File, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const family = user.family;
    if (!family) throw new NotFoundException('Family not found');

    const fileEntity = await this.fileService.upload(
      file.buffer,
      FileTypeEnum.FAMILY_BANNER,
    );
    family.banner = fileEntity;

    await this.familyRepository.save(family);
  }

  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const family = user.family;
    if (!family) throw new NotFoundException('Family not found');

    const avatar = await this.fileService.upload(
      file.buffer,
      FileTypeEnum.FAMILY_AVATAR,
    );
    family.avatar = avatar;

    await this.familyRepository.save(family);
  }

  async rejectJoinFamily(userId: string, ownerId: string): Promise<void> {
    const owner = await this.userService.findById(ownerId);
    if (!owner) throw new NotFoundException('User not found');
    const family = await this.familyRepository.findOne({
      where: { owner },
      relations: {
        joinRequests: true,
      },
    });
    if (!family) throw new NotFoundException('Family not found');

    const index = family.joinRequests.findIndex((user) => user.id == userId);
    if (index == -1)
      throw new NotFoundException('User not found in requests list');

    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    family.joinRequests.splice(index, 1);
    user.requestingToJoinFamily = null;

    await this.notificationService.create(
      {
        title: 'You have been rejected to join the family :(',
        body: 'The owner has rejected your join request.',
      },
      userId,
    );

    await this.familyRepository.save(family);
    await this.userService.changeUser(user);
  }
}
