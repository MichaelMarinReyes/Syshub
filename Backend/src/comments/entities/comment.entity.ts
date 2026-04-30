import { Publication } from "@/publications/entities/publication.entity";
import { User } from "@/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comentarios')
export class Comment {
    @PrimaryGeneratedColumn('uuid', { name: 'id_comentario' })
    idComment: string;

    @Column('text', { name: 'contenido' })
    content: string;

    @Column('integer', { name: 'puntuacion_calidad', default: 0 })
    qualityScore: number;

    @ManyToOne(() => Publication, (pub) => pub.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario' })
    user: User;
}