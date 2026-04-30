import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCommentDto {
    @IsUUID()
    @IsNotEmpty()
    idPublication: string;

    @IsUUID()
    @IsNotEmpty()
    idUser: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @IsOptional()
    qualityScore?: number;
}