import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { Pensum } from '@/pensum/entities/pensum.entity';
import { TechnicalArea } from '@/technical-area/entities/technical-area.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Pensum)
    private readonly pensumRepository: Repository<Pensum>,

    @InjectRepository(TechnicalArea)
    private readonly areaRepository: Repository<TechnicalArea>,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    const newCourse = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(newCourse);
  }

  async findAll() {
    return await this.courseRepository.find({
      relations: ['area', 'pensum'],
      order: { name: 'ASC' }
    });
  }

  async findByPensum(id: string) {
    const courses = await this.courseRepository.find({
      where: { id },
      relations: ['area'],
      order: {
        area: { name: 'ASC' },
        name: 'ASC'
      }
    });

    if (courses.length === 0) {
      throw new NotFoundException('No se encontraron cursos para el pensum con ID ingresado')
    }
    return courses;
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['area', 'pensum']
    });

    if (!course) {
      throw new NotFoundException('Curso con ID no encontrado');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.preload({
      id: id,
      ...updateCourseDto
    });

    if (!course) {
      throw new NotFoundException('No se puede actualizar porque el curso no existe');
    }

    return await this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    return await this.courseRepository.remove(course);
  }

  async findAllPensum() {
    return await this.pensumRepository.find({ order: { effectiveYear: 'DESC' } })
  }

  async findAllAreas() {
    return await this.areaRepository.find({ order: { name: 'ASC' } })
  }
}