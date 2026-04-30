import { Module } from '@nestjs/common';
import { PensumService } from './pensum.service';
import { PensumController } from './pensum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '@/course/entities/course.entity';
import { Pensum } from './entities/pensum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Pensum])],
  controllers: [PensumController],
  providers: [PensumService],
})
export class PensumModule {}
