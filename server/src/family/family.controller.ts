import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateFamilyDto } from 'src/dtos/createFamily.dto';
import { FamilyService } from './services/Family.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FamilyGuard } from './family.guard';
import { IJwtPayload } from 'src/types/IJwtPayload.interface';
import { AddRemoveMemberDto } from 'src/dtos/addMember.dto';

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
}
