import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostForumDto } from './dto/create-post_forum.dto';
import { UpdatePostForumDto } from './dto/update-post_forum.dto';
import { PostForum } from './entities/post_forum.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostForumsService {
  constructor(@InjectRepository(PostForum) private readonly postForumRepository: Repository<PostForum>) {}

  async create(createDto: CreatePostForumDto): Promise<PostForum> {
        const newPost = this.postForumRepository.create({
            idPublication: createDto.idPublication,
            isTechnicalQuestion: createDto.isTechnicalQuestion,
            resolutionStatus: createDto.resolutionStatus
        });
        return await this.postForumRepository.save(newPost);
    }

    async findAll(): Promise<PostForum[]> {
        return await this.postForumRepository.find({
            relations: ['publication', 'publication.user']
        });
    }

    async findOne(id: string): Promise<PostForum> {
        const post = await this.postForumRepository.findOne({
            where: { idPublication: id },
            relations: ['publication', 'publication.user', 'publication.tags']
        });

        if (!post) throw new NotFoundException('Post de foro no encontrado');
        return post;
    }

    async updateStatus(id: string, status: string): Promise<PostForum> {
        const post = await this.findOne(id);
        post.resolutionStatus = status;
        return await this.postForumRepository.save(post);
    }

  remove(id: string) {
    return `This action removes a #${id} postForum`;
  }
}