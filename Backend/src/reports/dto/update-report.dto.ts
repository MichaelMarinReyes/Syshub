import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {
    @IsUUID('4')
    @IsOptional()
    idAssignedModerator?: string;

    @IsString()
    @IsOptional()
    resolutionStatus?: string;
}