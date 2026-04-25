import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('comentarios')
export class Comment {
    @PrimaryGeneratedColumn('uuid', { name: 'id_comentario'})
    idComment: string;

    @Column('uuid', {name: 'id_publicacion'})
    idPublication: string;

    @Column('uuid', {name: ' id_usuario'})
    idUser: string;

    @Column('uuid', {name: 'contenido'})
    content: string;

    @Column('uuid', {name: 'puntuacion_calidad'})
    quality_score
}