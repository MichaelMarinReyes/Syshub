import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogArticlesService } from './blog_articles.service';
import { CreateBlogArticleDto } from './dto/create-blog_article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog_article.dto';

@Controller('blog-articles')
export class BlogArticlesController {
  constructor(private readonly blogArticlesService: BlogArticlesService) {}

  @Post()
  create(@Body() createBlogArticleDto: CreateBlogArticleDto) {
    return this.blogArticlesService.create(createBlogArticleDto);
  }

  @Get()
  findAll() {
    return this.blogArticlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogArticlesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogArticleDto: UpdateBlogArticleDto) {
    return this.blogArticlesService.update(id, updateBlogArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogArticlesService.remove(id);
  }
}
