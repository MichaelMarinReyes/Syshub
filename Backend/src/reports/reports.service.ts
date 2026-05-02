import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) { }

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const newReport = this.reportRepository.create({
      idPublication: createReportDto.idPublication,
      idUserReport: createReportDto.idUserReport,
      reasonComplaint: createReportDto.reasonComplaint,
      resolutionStatus: 'pendiente'
    });

    return await this.reportRepository.save(newReport);
  }

  async findAll() {
    return await this.reportRepository.find({
      relations: ['userReporter', 'publication', 'moderator'],
      order: {
        id: 'DESC'
      }
    })
  }

  async findOne(id: string) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['userReporter', 'publication', 'moderator']
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado')
    }

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.preload({
      id: id,
      ...updateReportDto
    });

    if (!report) {
      throw new NotFoundException('Reporte no existe, no se puede actualizar')
    }
    return await this.reportRepository.save(report);
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    return await this.reportRepository.remove(report);
  }

  async deleteReportAndContent(reportId: string) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['publication']
    });

    if (!report) {
      throw new NotFoundException('El reporte no existe');
    }

    const publicationId = report.idPublication;

    await this.reportRepository.delete(reportId);

    return await this.reportRepository.delete(publicationId);
  }
}
