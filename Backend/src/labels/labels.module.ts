import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './entities/label.entity';
import { Publication } from '@/publications/entities/publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label, Publication])],
  controllers: [LabelsController],
  providers: [LabelsService],
  exports: [TypeOrmModule]
})
export class LabelsModule { }
