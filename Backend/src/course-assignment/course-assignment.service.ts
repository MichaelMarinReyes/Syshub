import { ConflictException, Injectable } from '@nestjs/common';
import { CourseAssignment } from './entities/course-assignment.entity';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-course-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseAssignmentService {
  constructor(
        @InjectRepository(CourseAssignment) 
        private readonly assignmentRepository: Repository<CourseAssignment>
    ) {}

    async enroll(createAssignmentDto: CreateAssignmentDto, userId: string): Promise<CourseAssignment> {
        try {
            const assignment = this.assignmentRepository.create({
                idCourseAuxiliary: createAssignmentDto.idCourse,
                idUser: userId
            });
            return await this.assignmentRepository.save(assignment);
        } catch (error) {
            throw new ConflictException('El estudiante ya está asignado a este curso');
        }
    }

    async findStudentsByCourse(courseId: string): Promise<CourseAssignment[]> {
        return await this.assignmentRepository.find({
            where: { idCourseAuxiliary: courseId },
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