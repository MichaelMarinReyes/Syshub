import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "@/projects/entities/project.entity";
import { Technology } from "@/technologies/entities/technology.entity";

@Entity('proyecto_tecnologias')
export class ProjectTechnology {
    @PrimaryColumn('uuid', { name: 'id_publicacion' })
    idPublication: string;

    @PrimaryColumn('uuid', { name: 'id_tecnologia' })
    idTechnology: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    project: Project;

    @ManyToOne(() => Technology, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_tecnologia' })
    technology: Technology;
}