import { Module } from '@nestjs/common';
import { TechnologyProjectService } from './technology_project.service';
import { TechnologyProjectController } from './technology_project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTechnology } from './entities/technology_project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTechnology])],
  controllers: [TechnologyProjectController],
  providers: [TechnologyProjectService],
})
export class TechnologyProjectModule {}
