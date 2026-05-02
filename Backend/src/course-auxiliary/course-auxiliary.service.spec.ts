import { Test, TestingModule } from '@nestjs/testing';
import { CourseAuxiliaryService } from './course-auxiliary.service';

describe('CourseAuxiliaryService', () => {
  let service: CourseAuxiliaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseAuxiliaryService],
    }).compile();

    service = module.get<CourseAuxiliaryService>(CourseAuxiliaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
