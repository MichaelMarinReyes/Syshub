import { IsString } from "class-validator";

export class CreateLabelDto {
    @IsString()
    nameTag: string;
}