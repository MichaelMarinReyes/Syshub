import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail({}, { message: 'Email no válido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsUUID()
  @IsNotEmpty()
  @IsIn(['Moderador', 'Auxiliar', 'Estudiante'], {
    message: 'Solo puedes registrarte como Moderador, Auxiliar o Estudiante'
  })
  roleId?: string;0
}