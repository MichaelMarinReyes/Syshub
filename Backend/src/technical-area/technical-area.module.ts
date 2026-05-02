import { forwardRef, Module } from '@nestjs/common';
import { TechnicalAreaService } from './technical-area.service';
import { TechnicalAreaController } from './technical-area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalArea } from './entities/technical-area.entity';
import { CourseModule } from '@/course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicalArea]), forwardRef(() => CourseModule)],
  controllers: [TechnicalAreaController],
  providers: [TechnicalAreaService],
  exports: [TechnicalAreaService, TypeOrmModule]
})
export class TechnicalAreaModule { }
