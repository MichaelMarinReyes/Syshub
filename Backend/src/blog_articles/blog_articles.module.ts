import { Module } from '@nestjs/common';
import { BlogArticlesService } from './blog_articles.service';
import { BlogArticlesController } from './blog_articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogArticle } from './entities/blog_article.entity';
import { Publication } from '@/publications/entities/publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogArticle, Publication])],
  controllers: [BlogArticlesController],
  providers: [BlogArticlesService],
  exports: [BlogArticlesService]
})
export class BlogArticlesModule { }
