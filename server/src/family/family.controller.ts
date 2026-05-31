import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FamilyService } from './services/Family.service';
import { FamilyGuard } from './family.guard';
import { IJwtPayload } from 'src/types/IJwtPayload.interface';
import { AddRemoveMemberDto } from 'src/dtos/addMember.dto';
import { CreateFamilyDto } from '../dtos/createFamily.dto';
import { RequestToJoinFamilyDto } from '../dtos/RequestToJoinFamily.dto';
import { AcceptFamilyJoinDto } from '../dtos/AcceptFamilyJoin.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RejectFamilyJoinDto } from '../dtos/rejectFamilyJoin.dto';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createFamily(
    @Body(new ValidationPipe()) body: CreateFamilyDto,
    @Req() req: { user: IJwtPayload },
  ) {
    await this.familyService.create(body, req.user);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('add_member')
  async addMember(
    @Body(new ValidationPipe()) body: AddRemoveMemberDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.addMember(body, req.user.id);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('remove_member')
  async removeMember(
    @Body(new ValidationPipe()) body: AddRemoveMemberDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.removeMember(body.user_id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('request_to_join')
  async requestToJoinFamily(
    @Body(new ValidationPipe()) dto: RequestToJoinFamilyDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.requestToJoinFamily(req.user.id, dto.familyId);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('accept_join_request')
  async acceptJoinRequest(
    @Body(new ValidationPipe()) dto: AcceptFamilyJoinDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.acceptJoinFamily(dto.id, req.user.id);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @Post('reject_join_request')
  async rejectJoinRequest(
    @Body(new ValidationPipe()) dto: RejectFamilyJoinDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.rejectJoinFamily(dto.id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getFamily(@Req() req: { user: { id: string } }) {
    return await this.familyService.getByUser(req.user.id);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @UseInterceptors(FileInterceptor('banner'))
  @Patch('banner')
  async changeBanner(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.uploadBanner(file, req.user.id);
  }

  @UseGuards(AuthGuard, FamilyGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('avatar')
  async changeAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: string } },
  ) {
    await this.familyService.uploadAvatar(file, req.user.id);
  }
}
