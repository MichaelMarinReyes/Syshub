import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalAreaController } from './technical-area.controller';
import { TechnicalAreaService } from './technical-area.service';

describe('TechnicalAreaController', () => {
  let controller: TechnicalAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalAreaController],
      providers: [TechnicalAreaService],
    }).compile();

    controller = module.get<TechnicalAreaController>(TechnicalAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
