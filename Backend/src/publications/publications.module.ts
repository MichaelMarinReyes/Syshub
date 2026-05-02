import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { Publication } from './entities/publication.entity';
import { Label } from '@/labels/entities/label.entity';
import { Status } from '@/statuses/entities/status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/comments/entities/comment.entity';
import { Report } from '@/reports/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Label, Report, Comment, Status])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
    exports: [TypeOrmModule, PublicationsService]
})
export class PublicationsModule { }
