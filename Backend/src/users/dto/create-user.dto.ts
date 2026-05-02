import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail({}, { message: 'Correo electrónico no válido'})
    email!: string;

    @IsString()
    @MinLength(8, {message: 'La contraseña debe tener al meno 8 caracteres'})
    password!: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['Moderador', 'Auxiliar', 'Estudiante'], {
        message: 'Solo puedes registrarte como Moderador, Auxiliar o Estudiante'
    })
    roleId?: string;
}