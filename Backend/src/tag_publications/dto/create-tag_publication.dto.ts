import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePublicationTagDto {
  @IsUUID('4', { message: 'El ID de la publicación debe ser un UUID válido' })
  @IsNotEmpty()
  idPublication: string;

  @IsUUID('4', { message: 'El ID de la etiqueta debe ser un UUID válido' })
  @IsNotEmpty()
  idLabel: string;
}