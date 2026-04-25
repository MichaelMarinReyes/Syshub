import { Test, TestingModule } from '@nestjs/testing';
import { TagPublicationsController } from './tag_publications.controller';
import { TagPublicationsService } from './tag_publications.service';

describe('TagPublicationsController', () => {
  let controller: TagPublicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagPublicationsController],
      providers: [TagPublicationsService],
    }).compile();

    controller = module.get<TagPublicationsController>(TagPublicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
