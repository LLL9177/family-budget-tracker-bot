import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/auth/enums/Roles.enum';
import { IJwtPair } from 'src/types/IJwtPair.interface';
import { IJwtPayload } from 'src/types/IJwtPayload.interface';
import { UserService } from 'src/user/User.service';

interface IJwtTokenService {
  sign(payload: IJwtPayload): IJwtPair;
  validateAccess(access: string): IJwtPayload;
  validateRefresh(refresh: string): IJwtPayload;
  refresh(refresh: string): Promise<IJwtPair>;
}

@Injectable()
export class JwtTokenService implements IJwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  sign(payload: IJwtPayload): IJwtPair {
    const access = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const refresh = this.jwtService.sign(payload, {
      expiresIn: '5d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return { access, refresh };
  }

  validateAccess(access: string): IJwtPayload {
    return this.jwtService.verify(access, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  validateRefresh(refresh: string): IJwtPayload {
    try {
      return this.jwtService.verify(refresh, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Log in again');
    }
  }

  async refresh(refresh: string): Promise<IJwtPair> {
    const decode = this.validateRefresh(refresh);

    const updatedUser = await this.userService.findById(decode.id);
    if (!updatedUser) throw new UnauthorizedException('Invalid refresh token');

    return this.sign({
      id: updatedUser.id,
      roles: JSON.parse(updatedUser.roles) as Roles[],
    });
  }
}
