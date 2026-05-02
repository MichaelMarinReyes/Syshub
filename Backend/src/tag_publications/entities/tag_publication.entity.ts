import { Label } from "@/labels/entities/label.entity";
import { Publication } from "@/publications/entities/publication.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('tag_publicaciones')
export class PublicationTag {
  @PrimaryColumn({ type: 'uuid' })
  id_publicacion: string;

  @PrimaryColumn({ type: 'uuid' })
  id_etiqueta: string;

  @ManyToOne(() => Publication, (publication) => publication.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_publicacion' })
  publication: Publication;

  @ManyToOne(() => Label, (label) => label.publications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_etiqueta' })
  tag: Label;
}