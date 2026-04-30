import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateTechnologyProjectDto {
    @IsUUID()
    @IsNotEmpty()
    idPublication: string;

    @IsUUID()
    @IsNotEmpty()
    idTechnology: string;
}