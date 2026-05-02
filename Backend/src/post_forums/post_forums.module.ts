import { Module } from '@nestjs/common';
import { PostForumsService } from './post_forums.service';
import { PostForumsController } from './post_forums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostForum } from './entities/post_forum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostForum])],
  controllers: [PostForumsController],
  providers: [PostForumsService],
})
export class PostForumsModule { }
