import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Publication } from '@/publications/entities/publication.entity';
import { User } from '@/users/entities/user.entity';
import { PublicationsModule } from '@/publications/publications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Publication, User, PublicationsModule])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
