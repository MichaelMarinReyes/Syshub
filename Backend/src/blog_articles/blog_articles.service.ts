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
    private readonly blogRepo: Repository<BlogArticle>,
    @InjectRepository(Publication)
    private readonly publicacionesRepo: Repository<Publication>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBlogDto: CreateBlogArticleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevaPublicacion = queryRunner.manager.create(Publication, {
        title: createBlogDto.title,
        idUser: createBlogDto.idUsuario,
        idCourse: createBlogDto.idCurso,
        contentType: 'articulo',
      });
      const savedPublicacion = await queryRunner.manager.save(nuevaPublicacion);

      const articulo = queryRunner.manager.create(BlogArticle, {
        idPublication: savedPublicacion.id,
        body: createBlogDto.body,
        urlImage: createBlogDto.urlImage,
      });
      const savedArticulo = await queryRunner.manager.save(articulo);

      await queryRunner.commitTransaction();
      return { ...savedPublicacion, ...savedArticulo };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al crear el artículo de blog');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.blogRepo.find({
      relations: ['publicacion', 'publicacion.usuario'],
      order: { publication: { createdAt: 'DESC' } }
    });
  }

  async findOne(id: string) {
    const articulo = await this.blogRepo.findOne({
      where: { idPublication: id },
      relations: ['publicacion', 'publicacion.usuario', 'publicacion.comentarios'],
    });

    if (!articulo) throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    return articulo;
  }

  async update(id: string, updateBlogDto: UpdateBlogArticleDto) {
    const articulo = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateBlogDto.title || updateBlogDto.idCurso) {
        await queryRunner.manager.update(Publication, id, {
          title: updateBlogDto.title,
          idCourse: updateBlogDto.idCurso,
        });
      }

      await queryRunner.manager.update(BlogArticle, id, {
        body: updateBlogDto.body,
        urlImage: updateBlogDto.urlImage,
      });

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al actualizar el artículo');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const result = await this.publicacionesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`No se pudo eliminar el artículo ${id}`);
    return { deleted: true };
  }
}