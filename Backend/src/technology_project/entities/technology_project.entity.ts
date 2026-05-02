import { Project } from "@/projects/entities/project.entity";
import { Technology } from "@/technologies/entities/technology.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('proyecto_tecnologias')
export class ProjectTechnology {
    @PrimaryColumn('uuid', { name: 'id_publicacion' })
    idPublication: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    project: Project;

    @PrimaryColumn('uuid', { name: 'id_tecnologia' })
    idTechnology: string;

    @ManyToOne(() => Technology, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_tecnologia' })
    technology: Technology;
}