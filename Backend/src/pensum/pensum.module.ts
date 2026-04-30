import { Module } from '@nestjs/common';
import { PensumService } from './pensum.service';
import { PensumController } from './pensum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '@/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [PensumController],
  providers: [PensumService],
})
export class PensumModule {}
