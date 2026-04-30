import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalAreaService } from './technical-area.service';

describe('TechnicalAreaService', () => {
  let service: TechnicalAreaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnicalAreaService],
    }).compile();

    service = module.get<TechnicalAreaService>(TechnicalAreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
