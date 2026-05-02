import { Module } from '@nestjs/common';
import { CourseAuxiliaryService } from './course-auxiliary.service';
import { CourseAuxiliaryController } from './course-auxiliary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseAuxiliary } from './entities/course-auxiliary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseAuxiliary])],
  controllers: [CourseAuxiliaryController],
  providers: [CourseAuxiliaryService],
})
export class CourseAuxiliaryModule {}
