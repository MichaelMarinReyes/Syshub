import { Test, TestingModule } from '@nestjs/testing';
import { CourseAuxiliaryController } from './course-auxiliary.controller';
import { CourseAuxiliaryService } from './course-auxiliary.service';

describe('CourseAuxiliaryController', () => {
  let controller: CourseAuxiliaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseAuxiliaryController],
      providers: [CourseAuxiliaryService],
    }).compile();

    controller = module.get<CourseAuxiliaryController>(CourseAuxiliaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
