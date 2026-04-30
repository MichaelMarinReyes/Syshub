import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = this.projectRepository.create({
      id: createProjectDto.idPublication,
      technicalDescription: createProjectDto.technicalDescription,
      attachmentUrl: createProjectDto.attachmentUrl,
      isFeatured: createProjectDto.isFeatured,
    });
    return await this.projectRepository.save(newProject);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['publication', 'publication.user', 'publication.tags'],
      order: { isFeatured: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['publication', 'publication.user', 'publication.tags']
    });

    if (!project) throw new NotFoundException('Proyecto académico no encontrado');
    return project;
  }

  async toggleFeatured(id: string): Promise<Project> {
    const project = await this.findOne(id);
    project.isFeatured = !project.isFeatured;
    return await this.projectRepository.save(project);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
