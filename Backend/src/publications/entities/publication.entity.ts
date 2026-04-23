import { Report } from "@/reports/entities/report.entity";
import { User } from "@/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('publicaciones')
export class Publication {
    @PrimaryGeneratedColumn('uuid', {name: 'id_publicacion'})
    id: string;

    @Column({ name: 'titulo', type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'tipo_contenido', type: 'varchar', length: 20, nullable: true })
    contentType: string;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp'})
    createdAt: Date;

    @Column({ name: 'id_usuario', type: 'uuid', nullable: true})
    iduser: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario' })
    user: User;

    @Column({ name: 'id_curso', type: 'uuid', nullable: true })
    idCourse: string;

    @OneToMany(() => Report, (report) => report.publication)
    reports: Report[]
}