import { IsBoolean, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateProjectDto {
    @IsUUID()
    idPublication: string;

    @IsOptional()
    @IsString()
    technicalDescription?: string;

    @IsOptional()
    @IsUrl()
    attachmentUrl?: string;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}