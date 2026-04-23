import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '@/reports/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
