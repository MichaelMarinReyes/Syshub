import { Publication } from "@/publications/entities/publication.entity";
import { User } from "@/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comentarios')
export class Comment {
    @PrimaryGeneratedColumn('uuid', { name: 'id_comentario' })
    idComment: string;

    @Column({ name: 'id_publicacion', type: 'uuid' })
    idPublication: string;

    @ManyToOne(() => Publication, (publication) => publication.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;

    @Column({ name: 'id_usuario', type: 'uuid', nullable: true })
    idUser: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_usuario' })
    user: User;

    @Column({ name: 'contenido', type: 'text' })
    content: string;

    @Column({ name: 'puntuacion_calidad', type: 'integer', default: 0 })
    qualityScore: number;
}