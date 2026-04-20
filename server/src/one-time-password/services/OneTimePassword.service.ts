import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OneTimePasswordEntity } from '../entities/OneTimePassword.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface IOneTimePasswordService {
  create(): Promise<{ password: string; otpId: string }>;
  validate(password: string, userId: string): Promise<boolean>;
  delete(password: string): Promise<void>;
  syncUser(userId: string, id: string): Promise<void>;
  checkAllPasswords(): Promise<void>;
}

@Injectable()
export class OneTimePasswordService
  implements IOneTimePasswordService, OnApplicationBootstrap
{
  constructor(
    @InjectRepository(OneTimePasswordEntity)
    private readonly otpRepository: Repository<OneTimePasswordEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(): Promise<{ password: string; otpId: string }> {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    const array = new Uint8Array(16);
    crypto.getRandomValues(array);

    const password = Array.from(
      array,
      (byte) => charset[byte % charset.length],
    ).join('');

    const expiresAt = new Date(new Date().getTime() + 15 * 60 * 1000);

    const result = await this.otpRepository.save({ password, expiresAt });

    return { password, otpId: result.id };
  }

  async validate(password: string): Promise<boolean> {
    const otp = await this.otpRepository.findOneBy({ password });
    if (!otp) return false;
    return true;
  }

  async delete(password: string): Promise<void> {
    await this.otpRepository.delete({ password });
  }

  async syncUser(userId: string, id: string): Promise<void> {
    const otp = await this.otpRepository.findOneBy({ id });
    if (!otp) throw new NotFoundException();

    otp.userId = userId;
    await this.otpRepository.save(otp);
  }

  // @Cron('0 */15 * * * *') // 15 min
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.eventEmitter.emit('otp-expirations.check-expirations', {});
  }

  onApplicationBootstrap() {
    this.eventEmitter.emit('otp-expirations.check-expirations', {});
  }

  async checkAllPasswords(): Promise<void> {
    const passwords = await this.otpRepository.find();

    const expiredPasswords = passwords.filter((pass) => {
      const date = new Date().getTime();
      if (new Date(pass.expiresAt).getTime() < date) return true;
      return false;
    });

    for (const pass of expiredPasswords) {
      await this.delete(pass.password);
    }
  }
}
