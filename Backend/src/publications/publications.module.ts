import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/publication.entity';
import { Label } from '@/labels/entities/label.entity';
import { Report } from '@/reports/entities/report.entity';
import { Comment } from '@/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Label, Report, Comment])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
  exports: [TypeOrmModule, PublicationsService]
})
export class PublicationsModule {}
