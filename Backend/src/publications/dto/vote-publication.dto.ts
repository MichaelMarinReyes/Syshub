import { IsInt, Min, Max } from 'class-validator';

export class VotePublicationDto {
    @IsInt()
    @Min(1)
    @Max(5)
    stars: number;
}