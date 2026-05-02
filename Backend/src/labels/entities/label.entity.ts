import { Publication } from "@/publications/entities/publication.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('etiquetas')
export class Label {
    @PrimaryGeneratedColumn('uuid', { name: 'id_etiqueta' })
    idLabel: string;

    @Column({ name: 'nombre_tag', type: 'varchar', length: 50, unique: true })
    nameTag: string;

    @ManyToMany(() => Publication, (publication) => publication.tags)
    publications: Publication[];
}