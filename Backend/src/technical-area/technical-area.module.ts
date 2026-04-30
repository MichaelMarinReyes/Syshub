import { forwardRef, Module } from '@nestjs/common';
import { TechnicalAreaService } from './technical-area.service';
import { TechnicalAreaController } from './technical-area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '@/course/entities/course.entity';
import { CourseModule } from '@/course/course.module';
import { TechnicalArea } from './entities/technical-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicalArea]), forwardRef(() => CourseModule)],
  controllers: [TechnicalAreaController],
  providers: [TechnicalAreaService],
  exports: [TechnicalAreaService, TypeOrmModule]
})
export class TechnicalAreaModule { }
