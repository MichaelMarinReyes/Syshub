import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-course-assignment.dto';

export class UpdateCourseAssignmentDto extends PartialType(CreateAssignmentDto) {}
