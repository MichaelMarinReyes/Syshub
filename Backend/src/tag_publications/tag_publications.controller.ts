import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagPublicationsService } from './tag_publications.service';
import { CreateTagPublicationDto } from './dto/create-tag_publication.dto';
import { UpdateTagPublicationDto } from './dto/update-tag_publication.dto';

@Controller('tag-publications')
export class TagPublicationsController {
  constructor(private readonly tagPublicationsService: TagPublicationsService) {}

  @Post()
  create(@Body() createTagPublicationDto: CreateTagPublicationDto) {
    return this.tagPublicationsService.create(createTagPublicationDto);
  }

  @Get()
  findAll() {
    return this.tagPublicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagPublicationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagPublicationDto: UpdateTagPublicationDto) {
    return this.tagPublicationsService.update(+id, updateTagPublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagPublicationsService.remove(+id);
  }
}
