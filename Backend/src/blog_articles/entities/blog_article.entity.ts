import { Publication } from "@/publications/entities/publication.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('articulos_blogs')
export class BlogArticle {
    @PrimaryColumn('uuid', { name: 'id_publicacion' })
    idPublication: string;

    @Column({ name: 'cuerpo_extenso', type: 'text' })
    body: string;

    @Column({ name: 'url_imagen_portada', type: 'text', nullable: true })
    urlImage: string;

    @OneToOne(() => Publication, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;
}