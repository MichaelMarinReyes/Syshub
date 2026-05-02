import { Module } from '@nestjs/common';
import { TagPublicationsService } from './tag_publications.service';
import { TagPublicationsController } from './tag_publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TagPublicationsController])],
  controllers: [TagPublicationsController],
  providers: [TagPublicationsService],
})
export class TagPublicationsModule {}
