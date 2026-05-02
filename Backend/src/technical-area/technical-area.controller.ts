import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TechnicalAreaService } from './technical-area.service';
import { CreateTechnicalAreaDto } from './dto/create-technical-area.dto';
import { UpdateTechnicalAreaDto } from './dto/update-technical-area.dto';
import { CourseService } from '@/course/course.service';

@Controller('technical-area')
export class TechnicalAreaController {
  constructor(
    private readonly technicalAreaService: TechnicalAreaService,
    private readonly coursesService: CourseService
  ) { }

  @Post()
  create(@Body() createDto: CreateTechnicalAreaDto) {
    return this.technicalAreaService.create(createDto);
  }

  @Get()
  findAll() {
    return this.technicalAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.technicalAreaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnicalAreaDto: UpdateTechnicalAreaDto) {
    return this.technicalAreaService.update(id, updateTechnicalAreaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.technicalAreaService.remove(id);
  }

  @Get('all-pensums')
  findAllPensums() {
    return this.coursesService.findAllPensum();
  }
}