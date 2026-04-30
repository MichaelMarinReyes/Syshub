import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateBlogArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUUID()
    @IsNotEmpty()
    idUsuario: string;

    @IsUUID()
    @IsOptional()
    idCurso?: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsUrl()
    @IsOptional()
    urlImage?: string;
}