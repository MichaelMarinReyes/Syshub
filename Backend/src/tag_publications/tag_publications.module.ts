import { Module } from '@nestjs/common';
import { TagPublicationsService } from './tag_publications.service';
import { TagPublicationsController } from './tag_publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationTag } from './entities/tag_publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationTag])],
  controllers: [TagPublicationsController],
  providers: [TagPublicationsService],
})
export class TagPublicationsModule {}
