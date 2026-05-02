import { Test, TestingModule } from '@nestjs/testing';
import { TagPublicationsService } from './tag_publications.service';

describe('TagPublicationsService', () => {
  let service: TagPublicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagPublicationsService],
    }).compile();

    service = module.get<TagPublicationsService>(TagPublicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
