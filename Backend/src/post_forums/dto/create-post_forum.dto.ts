import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostForumDto {
    @IsUUID()
    idPublication: string;

    @IsOptional()
    @IsBoolean()
    isTechnicalQuestion?: boolean;

    @IsOptional()
    @IsString()
    resolutionStatus?: string;
}