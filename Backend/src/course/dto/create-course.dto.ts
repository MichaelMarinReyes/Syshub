import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del curso es obligatorio'})
    @MinLength(3, { message: 'El nombre del curso es muy corto'})
    @MaxLength(150, { message: 'El nombre del curso excede los 150 caracteres'})
    nombreCurso: string;

    @IsUUID('4', { message: 'El id de área debe ser un UUID válido de Área Técnica'})
    @IsNotEmpty({ message: 'El curso debe pertenecer a un área técnica'})
    idArea: string;

    @IsUUID('4', {message: 'El id de pensum debe ser un UUID válido de Pensum'})
    @IsNotEmpty({ message: 'El curso debe estar asociado a un pensum'})
    idPensum: string;
}
