import { Test, TestingModule } from '@nestjs/testing';
import { CourseAssignmentService } from './course-assignment.service';

describe('CourseAssignmentService', () => {
  let service: CourseAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseAssignmentService],
    }).compile();

    service = module.get<CourseAssignmentService>(CourseAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
