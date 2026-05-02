import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TechnologyProjectService } from './technology_project.service';
import { CreateTechnologyProjectDto } from './dto/create-technology_project.dto';
import { UpdateTechnologyProjectDto } from './dto/update-technology_project.dto';

@Controller('technology-project')
export class TechnologyProjectController {
  constructor(private readonly technologyProjectService: TechnologyProjectService) { }

  @Post()
  create(@Body() createTechnologyProjectDto: CreateTechnologyProjectDto) {
    return this.technologyProjectService.create(createTechnologyProjectDto);
  }

  @Get()
  findAll() {
    return this.technologyProjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.technologyProjectService.findByOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnologyProjectDto: UpdateTechnologyProjectDto) {
    return this.technologyProjectService.update(id, updateTechnologyProjectDto);
  }

  @Delete(':id')
  remove(@Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('technologyId', ParseUUIDPipe) technologyId: string
  ) {
    return this.technologyProjectService.remove(projectId, technologyId);
  }
}