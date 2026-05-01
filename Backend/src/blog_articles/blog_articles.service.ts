import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BlogArticle } from './entities/blog_article.entity';
import { Publication } from '@/publications/entities/publication.entity';
import { CreateBlogArticleDto } from './dto/create-blog_article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog_article.dto';

@Injectable()
export class BlogArticlesService {
  constructor(
    @InjectRepository(BlogArticle)
    private readonly repositorioBlog: Repository<BlogArticle>,
    @InjectRepository(Publication)
    private readonly repositorioPub: Repository<Publication>,
    private readonly dataSource: DataSource,
  ) { }

  async create(dto: CreateBlogArticleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPublication = queryRunner.manager.create(Publication, {
        title: dto.title,
        idUser: dto.idUsuario,
        idCourse: dto.idCurso || undefined,
        contentType: 'blog'
      } as Publication);
      const pubSave = await queryRunner.manager.save(newPublication);

      const newArticle = queryRunner.manager.create(BlogArticle, {
        idPublication: pubSave.id,
        body: dto.body,
        urlImage: dto.urlImage
      });

      const result = await queryRunner.manager.save(newArticle);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al crear el artículo en el servidor');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.repositorioBlog.find({
      relations: ['publication', 'publication.user'],
      order: {
        publication: { createdAt: 'DESC' }
      }
    });
  }

  async findOne(id: string) {
    const articulo = await this.repositorioBlog.findOne({
      where: { idPublication: id },
      relations: ['publication', 'publication.user', 'publication.comments'],
    });

    if (!articulo) {
      throw new NotFoundException(`El artículo con ID ${id} no existe`);
    }
    return articulo;
  }

  async update(id: string, updateDto: UpdateBlogArticleDto) {
    await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateDto.title || updateDto.idCurso) {
        await queryRunner.manager.update(Publication, id, {
          title: updateDto.title,
          idCourse: updateDto.idCurso,
        });
      }

      await queryRunner.manager.update(BlogArticle, id, {
        body: updateDto.body,
        urlImage: updateDto.urlImage,
      });

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al intentar actualizar el recurso');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const result = await this.repositorioPub.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el artículo ${id} para eliminar`);
    }
    return { mensaje: 'Artículo eliminado exitosamente', id };
  }
}