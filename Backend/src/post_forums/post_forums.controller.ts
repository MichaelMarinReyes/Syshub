import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PostForumsService } from './post_forums.service';
import { CreatePostForumDto } from './dto/create-post_forum.dto';
import { UpdatePostForumDto } from './dto/update-post_forum.dto';

@Controller('post-forums')
export class PostForumsController {
  constructor(private readonly postForumsService: PostForumsService) { }

  @Post()
  create(@Body() createPostForumDto: CreatePostForumDto) {
    return this.postForumsService.create(createPostForumDto);
  }

  @Get()
  findAll() {
    return this.postForumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postForumsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string
  ) {
    return this.postForumsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postForumsService.remove(id);
  }
}