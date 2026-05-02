import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseAuxiliaryDto } from './dto/create-course-auxiliary.dto';
import { UpdateCourseAuxiliaryDto } from './dto/update-course-auxiliary.dto';
import { CourseAuxiliary } from './entities/course-auxiliary.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseAuxiliaryService {
  constructor(
        @InjectRepository(CourseAuxiliary)
        private readonly repo: Repository<CourseAuxiliary>,
    ) {}

    async create(dto: CreateCourseAuxiliaryDto) {
        const exists = await this.repo.findOne({ where: { accessCode: dto.accessCode } });
        if (exists) throw new ConflictException('El código de acceso ya existe');

        const newEntry = this.repo.create(dto);
        return await this.repo.save(newEntry);
    }

    async findAll() {
        return await this.repo.find({ relations: ['course', 'user'] });
    }

    async findByAuxiliary(idUser: string) {
        return await this.repo.find({
            where: { idUser },
            relations: ['course']
        });
    }

    async findByCode(accessCode: string) {
        const entry = await this.repo.findOne({
            where: { accessCode },
            relations: ['course', 'user']
        });
        if (!entry) throw new NotFoundException('Curso no encontrado con ese código');
        return entry;
    }

    async remove(id: string) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Asignación no encontrada');
        return { deleted: true };
    }
}