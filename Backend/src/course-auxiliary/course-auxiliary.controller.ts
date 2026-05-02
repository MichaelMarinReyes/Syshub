import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseAuxiliaryService } from './course-auxiliary.service';
import { CreateCourseAuxiliaryDto } from './dto/create-course-auxiliary.dto';
import { UpdateCourseAuxiliaryDto } from './dto/update-course-auxiliary.dto';

@Controller('course-auxiliary')
export class CourseAuxiliaryController {
  constructor(private readonly courseAuxiliaryService: CourseAuxiliaryService) {}

  @Post()
  create(@Body() createCourseAuxiliaryDto: CreateCourseAuxiliaryDto) {
    return this.courseAuxiliaryService.create(createCourseAuxiliaryDto);
  }

  @Get()
  findAll() {
    return this.courseAuxiliaryService.findAll();
  }
/*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseAuxiliaryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseAuxiliaryDto: UpdateCourseAuxiliaryDto) {
    return this.courseAuxiliaryService.update(id, updateCourseAuxiliaryDto);
  }*/

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseAuxiliaryService.remove(id);
  }
}
