import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalArea } from '@/technical-area/entities/technical-area.entity';
import { Course } from './entities/course.entity';
import { Pensum } from '@/pensum/entities/pensum.entity';
import { TechnicalAreaController } from '@/technical-area/technical-area.controller';
import { PensumController } from '@/pensum/pensum.controller';
import { TechnicalAreaService } from '@/technical-area/technical-area.service';
import { TechnicalAreaModule } from '@/technical-area/technical-area.module';
import { PensumService } from '@/pensum/pensum.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Pensum]), forwardRef(() => TechnicalAreaModule)],
  controllers: [CourseController, PensumController],
  providers: [CourseService, PensumService],
  exports: [CourseService, TypeOrmModule]
})
export class CourseModule {}
