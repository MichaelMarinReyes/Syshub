import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreatePublicationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    contentType?: string;

    @IsUUID()
    @IsOptional()
    idUser?: string;

    @IsArray()
    @IsUUID("4", { each: true })
    @IsOptional()
    tagIds?: string[];
}