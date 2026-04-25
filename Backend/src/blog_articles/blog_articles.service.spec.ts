import { Test, TestingModule } from '@nestjs/testing';
import { BlogArticlesService } from './blog_articles.service';

describe('BlogArticlesService', () => {
  let service: BlogArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogArticlesService],
    }).compile();

    service = module.get<BlogArticlesService>(BlogArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
