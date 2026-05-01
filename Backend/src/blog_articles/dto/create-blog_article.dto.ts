import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateBlogArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUUID()
    @IsNotEmpty()
    idUser: string;

    @IsUUID()
    @IsOptional()
    idCourse?: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsUrl()
    @IsOptional()
    urlImage?: string;
}