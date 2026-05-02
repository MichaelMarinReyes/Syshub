import { Publication } from "@/publications/entities/publication.entity";
import { User } from "@/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

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

    @Column({ name: 'fecha_destacado', type: 'timestamp', nullable: true })
    featuredAt: Date;

    @Column({ name: 'id_auxiliar_curador', type: 'uuid', nullable: true })
    idCurator: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_auxiliar_curador' })
    curator: User;

    @OneToOne(() => Publication, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;
}