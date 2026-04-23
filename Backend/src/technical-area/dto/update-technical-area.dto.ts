import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnicalAreaDto } from './create-technical-area.dto';

export class UpdateTechnicalAreaDto extends PartialType(CreateTechnicalAreaDto) {}
