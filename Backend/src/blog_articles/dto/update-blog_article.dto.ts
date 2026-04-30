import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogArticleDto } from './create-blog_article.dto';

export class UpdateBlogArticleDto extends PartialType(CreateBlogArticleDto) {}
