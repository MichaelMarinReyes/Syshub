import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TagPublicationsService } from './tag_publications.service';
import { CreatePublicationTagDto } from './dto/create-tag_publication.dto';

@Controller('tag-publications')
export class TagPublicationsController {
  constructor(private readonly tagPubService: TagPublicationsService) {}

  @Post()
  create(@Body() createDto: CreatePublicationTagDto) {
    return this.tagPubService.create(createDto);
  }

  @Get(':id_publicacion')
  findAllByPub(@Param('id_publicacion', ParseUUIDPipe) id: string) {
    return this.tagPubService.findByPublication(id);
  }

  @Delete(':pubId/:tagId')
  remove(
    @Param('pubId', ParseUUIDPipe) pubId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    return this.tagPubService.remove(pubId, tagId);
  }
}