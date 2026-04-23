import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTechnicalAreaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del área técnica es obligatorio'})
    name: string;
}