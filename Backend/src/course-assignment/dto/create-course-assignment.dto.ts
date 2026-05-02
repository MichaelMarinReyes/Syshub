import { IsUUID } from 'class-validator';

export class CreateAssignmentDto {
    @IsUUID()
    idCourse!: string;
}