import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateStatusDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;
}