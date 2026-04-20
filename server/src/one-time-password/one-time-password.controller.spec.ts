import { Test, TestingModule } from '@nestjs/testing';
import { OneTimePasswordController } from './one-time-password.controller';

describe('OneTimePasswordController', () => {
  let controller: OneTimePasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OneTimePasswordController],
    }).compile();

    controller = module.get<OneTimePasswordController>(OneTimePasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
