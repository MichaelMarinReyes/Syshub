import { Module } from '@nestjs/common';
import { TagPublicationsService } from './tag_publications.service';
import { TagPublicationsController } from './tag_publications.controller';

@Module({
  controllers: [TagPublicationsController],
  providers: [TagPublicationsService],
})
export class TagPublicationsModule {}
