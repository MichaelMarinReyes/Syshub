import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseAssignment } from './entities/course-assignment.entity';
import { CreateAssignmentDto } from './dto/create-course-assignment.dto';

@Injectable()
export class CourseAssignmentsService {
    constructor(
        @InjectRepository(CourseAssignment) 
        private readonly assignmentRepository: Repository<CourseAssignment>
    ) {}

    async enroll(createAssignmentDto: CreateAssignmentDto, userId: string): Promise<CourseAssignment> {
        try {
            const assignment = this.assignmentRepository.create({
                idCourse: createAssignmentDto.idCourse,
                idUser: userId
            });
            return await this.assignmentRepository.save(assignment);
        } catch (error) {
            throw new ConflictException('El estudiante ya está asignado a este curso');
        }
    }

    async findStudentsByCourse(courseId: string): Promise<CourseAssignment[]> {
        return await this.assignmentRepository.find({
            where: { idCourse: courseId },
            relations: ['user'],
            order: { assignedAt: 'DESC' }
        });
    }

    async findMyCourses(userId: string): Promise<CourseAssignment[]> {
        return await this.assignmentRepository.find({
            where: { idUser: userId },
            relations: ['course']
        });
    }
}