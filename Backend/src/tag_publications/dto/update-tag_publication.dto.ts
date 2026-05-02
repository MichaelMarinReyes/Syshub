import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationTagDto } from './create-tag_publication.dto';

export class UpdateTagPublicationDto extends PartialType(CreatePublicationTagDto) {}
