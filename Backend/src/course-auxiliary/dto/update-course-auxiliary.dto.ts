import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseAuxiliaryDto } from './create-course-auxiliary.dto';

export class UpdateCourseAuxiliaryDto extends PartialType(CreateCourseAuxiliaryDto) {}
