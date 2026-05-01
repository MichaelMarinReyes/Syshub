import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @IsInt()
    @IsOptional()
    @Min(0)
    qualityScore?: number;
}