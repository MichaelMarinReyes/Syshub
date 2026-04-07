import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { Status } from './entities/status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService],
  imports: [TypeOrmModule.forFeature([Status])],
  exports: [TypeOrmModule]
})
export class StatusesModule { }
