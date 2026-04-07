import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    @IsNotEmpty({ message: '"l correo es obligatorio' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: ' La contraseña debe tener al menos 8 caracteres' })
    password!: string;
}