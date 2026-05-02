import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from "class-validator";

export class CreatePensumDto {
    @IsString()
    @IsNotEmpty({ message: 'El código del pensum es obligatorio ' })
    @MaxLength(20, { message: 'El código no puede exceder los 20 caracteres' })
    code: string;

    @IsInt({ message: 'El año de vigencia debe ser un número entero' })
    @IsNotEmpty({ message: 'El año de vigencia es obligatorio' })
    @Min(1970, { message: 'El año de vigencia no es váildo' })
    @Max(2050, { message: 'El año de vigencia está fuera de rango' })
    effectiveYear: number;
}