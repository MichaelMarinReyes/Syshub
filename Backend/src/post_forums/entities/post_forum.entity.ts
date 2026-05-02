import { Publication } from "@/publications/entities/publication.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('posts_foros')
export class PostForum {
    @PrimaryGeneratedColumn('uuid', { name: 'id_publicacion' })
    idPublication: string;

    @Column({ name: 'es_pregunta_tecnica', type: 'boolean', default: true })
    isTechnicalQuestion: boolean;

    @Column({ name: 'estado_resolucion', type: 'varchar', length: 50, default: 'abierto' })
    resolutionStatus: string;

    @OneToOne(() => Publication, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;
}