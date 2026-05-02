import { Test, TestingModule } from '@nestjs/testing';
import { CourseAssignmentController } from './course-assignment.controller';
import { CourseAssignmentService } from './course-assignment.service';

describe('CourseAssignmentController', () => {
  let controller: CourseAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseAssignmentController],
      providers: [CourseAssignmentService],
    }).compile();

    controller = module.get<CourseAssignmentController>(CourseAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
