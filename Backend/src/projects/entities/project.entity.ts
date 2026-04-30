import { Publication } from "@/publications/entities/publication.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('proyectos')
export class Project {
    @PrimaryColumn('uuid', { name: 'id_publicacion' })
    id: string;

    @Column({ name: 'descripcion_tecnica', type: 'text', nullable: true })
    technicalDescription: string;

    @Column({ name: 'url_adjunto', type: 'text', nullable: true })
    attachmentUrl: string;

    @Column({ name: 'es_destacado', type: 'boolean', default: false })
    isFeatured: boolean;

    @OneToOne(() => Publication, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;
}