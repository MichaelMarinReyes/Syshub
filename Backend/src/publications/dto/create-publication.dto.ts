export class CreatePublicationDto {
    title: string;
    contentType?: string;
    idUser?: string;
    idCourse?: string;
    tagIds?: string[];
}