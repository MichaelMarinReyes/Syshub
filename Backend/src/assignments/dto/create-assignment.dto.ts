import { IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateAssignmentDto {
    @IsUUID()
    idPublication!: string;

    @IsUrl()
    resourceLink!: string;

    @IsString()
    @IsOptional()
    studentComment?: string;
}