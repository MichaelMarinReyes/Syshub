import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateReportDto {
    @IsUUID('4', { message: 'El id de la publicación es incorrecto' })
    @IsNotEmpty()
    idPublicacion: string;

    @IsUUID('4', { message: 'El id del usuario es incorrecto' })
    @IsNotEmpty()
    idUserReport: string;

    @IsString()
    @IsNotEmpty({ message: 'El motivo de la denuncia no puede estar vacío' })
    reasonComplaint: string;
}