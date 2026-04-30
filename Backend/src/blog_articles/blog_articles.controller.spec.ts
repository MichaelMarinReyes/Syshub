import { Test, TestingModule } from '@nestjs/testing';
import { BlogArticlesController } from './blog_articles.controller';
import { BlogArticlesService } from './blog_articles.service';

describe('BlogArticlesController', () => {
  let controller: BlogArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogArticlesController],
      providers: [BlogArticlesService],
    }).compile();

    controller = module.get<BlogArticlesController>(BlogArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
