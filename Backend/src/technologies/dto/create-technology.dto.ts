import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTechnologyDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    category?: string;
}