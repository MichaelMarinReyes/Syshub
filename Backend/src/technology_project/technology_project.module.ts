import { Module } from '@nestjs/common';
import { TechnologyProjectService } from './technology_project.service';
import { TechnologyProjectController } from './technology_project.controller';

@Module({
  controllers: [TechnologyProjectController],
  providers: [TechnologyProjectService],
})
export class TechnologyProjectModule {}
