import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyProjectDto } from './create-technology_project.dto';

export class UpdateTechnologyProjectDto extends PartialType(CreateTechnologyProjectDto) {}
