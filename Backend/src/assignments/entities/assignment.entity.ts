import { Publication } from "@/publications/entities/publication.entity";
import { Status } from "@/statuses/entities/status.entity";
import { User } from "@/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('entregas_tareas')
export class Assignment {
    @PrimaryGeneratedColumn('uuid', { name: 'id_entrega' })
    id!: string;

    @Column({ name: 'id_publicacion', type: 'uuid' })
    idPublication!: string;

    @ManyToOne(() => Publication, (publication) => publication.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication!: Publication;

    @Column({ name: 'id_usuario', type: 'uuid' })
    idUser!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    user!: User;

    @Column({ name: 'enlace_recurso', type: 'text', nullable: true })
    resourceLink?: string;

    @Column({ name: 'comentario_estudiante', type: 'text', nullable: true })
    studentComment?: string;

    @CreateDateColumn({ name: 'fecha_entrega', type: 'timestamp' })
    submittedAt!: Date;

    @Column({ name: 'calificacion', type: 'numeric', precision: 5, scale: 2, default: 0.00 })
    grade!: number;

    @Column({ name: 'id_estado', type: 'uuid', nullable: true })
    idStatus?: string;

    @ManyToOne(() => Status)
    @JoinColumn({ name: 'id_estado' })
    status?: Status;
}