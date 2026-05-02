import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Status } from '@/statuses/entities/status.entity';
import { Repository } from 'typeorm';
import { GradeAssignmentDto } from './dto/grade-assignment.dt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment) private readonly submissionRepository: Repository<Assignment>,
    @InjectRepository(Status) private readonly statusRepository: Repository<Status>,
  ) { }

  async create(createSubmissionDto: CreateAssignmentDto, userId: string): Promise<Assignment> {
    const defaultStatus = await this.statusRepository.findOne({ where: { name: 'Entregado' } });

    const newSubmission = this.submissionRepository.create({
      ...createSubmissionDto,
      idUser: userId,
      idStatus: defaultStatus?.id
    });

    return await this.submissionRepository.save(newSubmission);
  }

  async findByPublication(publicationId: string): Promise<Assignment[]> {
    return await this.submissionRepository.find({
      where: { idPublication: publicationId },
      relations: ['user', 'status']
    });
  }

  async grade(id: string, gradeSubmissionDto: GradeAssignmentDto): Promise<Assignment> {
    const submission = await this.submissionRepository.findOne({ where: { id } });
    if (!submission) throw new NotFoundException('Entrega no encontrada');

    submission.grade = gradeSubmissionDto.grade;

    const gradedStatus = await this.statusRepository.findOne({ where: { name: 'Calificado' } });
    if (gradedStatus) submission.idStatus = gradedStatus.id;

    return await this.submissionRepository.save(submission);
  }
}