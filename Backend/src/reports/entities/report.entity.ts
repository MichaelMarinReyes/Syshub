import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@/users/entities/user.entity";
import { Publication } from "@/publications/entities/publication.entity";


@Entity('reportes')
export class Report {
    @PrimaryGeneratedColumn('uuid', { name: 'id_reporte' })
    id: string;

    @Column({ name: 'motivo_denuncia', type: 'text' })
    reasonComplaint: string;

    @Column({
        name: 'estado_resolucion',
        type: 'varchar',
        length: 50,
        default: 'pendiente'
    })
    resolutionStatus: string;

    @Column({ type: 'uuid', name: 'id_publicacion', nullable: true })
    idPublication: string;

    @ManyToOne(() => Publication, (publication) => publication.reports)
    @JoinColumn({ name: 'id_publicacion' })
    publication: Publication;

    @Column({ type: 'uuid', name: 'id_usuario_reporta', nullable: true })
    idUserReport: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario_reporta' })
    userReporter: User;

    @Column({ type: 'uuid', name: 'id_moderador_asignado', nullable: true })
    idAssignedModerator: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_moderador_asignado' })
    moderator: User;
}