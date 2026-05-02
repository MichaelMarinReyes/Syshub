import { Publication } from "@/publications/entities/publication.entity";
import { User } from "@/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reportes')
export class Report {
    @PrimaryGeneratedColumn('uuid', { name: 'id_reporte' })
    id: string;

    @Column({ name: 'id_publicacion', type: 'uuid' })
    idPublication: string;

    @ManyToOne(() => Publication, (publication) => publication.reports, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;

    @Column({ name: 'id_usuario_reporta', type: 'uuid', nullable: true })
    idUserReport: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario_reporta' })
    userReporter: User;

    @Column({ name: 'motivo_denuncia', type: 'text' })
    reasonComplaint: string;

    @Column({ name: 'id_moderador_asignado', type: 'uuid', nullable: true })
    idAssignedModerator: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_moderador_asignado' })
    moderator: User;

    @Column({
        name: 'estado_resolucion',
        type: 'varchar',
        length: 50,
        default: 'pendiente'
    })
    resolutionStatus: string;
}