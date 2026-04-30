import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { Status } from './entities/status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService],
  exports: [TypeOrmModule]
})
export class StatusesModule { }
