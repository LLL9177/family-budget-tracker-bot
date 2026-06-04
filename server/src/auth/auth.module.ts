import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/User.entity';
import { HashService } from './services/Hash.service';
import { AuthService } from './services/Auth.service';
import { JwtTokenService } from 'src/jwt/Jwt.service';
import { JwtService } from '@nestjs/jwt';
import { OneTimePasswordModule } from 'src/one-time-password/one-time-password.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    OneTimePasswordModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, JwtTokenService, JwtService],
  exports: [AuthService, JwtTokenService, HashService],
})
export class AuthModule {}
