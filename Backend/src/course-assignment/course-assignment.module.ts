import { Module } from '@nestjs/common';
import { CourseAssignmentService } from './course-assignment.service';
import { CourseAssignmentController } from './course-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseAssignment } from './entities/course-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseAssignment])],
  controllers: [CourseAssignmentController],
  providers: [CourseAssignmentService],
})
export class CourseAssignmentModule {}
