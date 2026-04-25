import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyProjectService } from './technology_project.service';

describe('TechnologyProjectService', () => {
  let service: TechnologyProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnologyProjectService],
    }).compile();

    service = module.get<TechnologyProjectService>(TechnologyProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
