import { Module } from '@nestjs/common';
import { CourseAssignmentService } from './course-assignment.service';
import { CourseAssignmentController } from './course-assignment.controller';

@Module({
  controllers: [CourseAssignmentController],
  providers: [CourseAssignmentService],
})
export class CourseAssignmentModule {}
