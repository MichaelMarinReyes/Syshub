import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyProjectController } from './technology_project.controller';
import { TechnologyProjectService } from './technology_project.service';

describe('TechnologyProjectController', () => {
  let controller: TechnologyProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologyProjectController],
      providers: [TechnologyProjectService],
    }).compile();

    controller = module.get<TechnologyProjectController>(TechnologyProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
