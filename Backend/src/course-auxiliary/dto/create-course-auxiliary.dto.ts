import { IsUUID, IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCourseAuxiliaryDto {
    @IsUUID()
    @IsNotEmpty()
    idCourse: string;

    @IsUUID()
    @IsNotEmpty()
    idUser: string;

    @IsString()
    @IsNotEmpty()
    @Length(5, 10)
    accessCode: string;
}