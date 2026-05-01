import { Report } from "@/reports/entities/report.entity";
import { User } from "@/users/entities/user.entity";
import { Comment } from "@/comments/entities/comment.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Label } from "@/labels/entities/label.entity";
import { Course } from "@/course/entities/course.entity";
import { Status } from "@/statuses/entities/status.entity";

@Entity('publicaciones')
export class Publication {
    @PrimaryGeneratedColumn('uuid', { name: 'id_publicacion' })
    id: string;

    @Column({ name: 'titulo', type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'tipo_contenido', type: 'varchar', length: 20, nullable: true })
    contentType: string;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
    createdAt: Date;

    @Column({ name: 'id_estado', type: 'uuid', nullable: true })
    idStatus: string;

    @ManyToOne(() => Status)
    @JoinColumn({ name: 'id_estado' })
    status: Status;

    @Column({ name: 'id_usuario', type: 'uuid', nullable: true })
    idUser: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    user: User;

    @Column({ name: 'id_curso', type: 'uuid', nullable: true })
    idCourse: string;

    @ManyToOne(() => Course)
    @JoinColumn({ name: 'id_curso'})
    course: Course;
    
    @OneToMany(() => Report, (report) => report.publication)
    reports: Report[];

    @OneToMany(() => Comment, (comment) => comment.publication)
    comments: Comment[];

    @ManyToMany(() => Label, (label) => label.publications)
    @JoinTable({
        name: 'tag_publicaciones',
        joinColumn: {
            name: 'id_publicacion',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'id_etiqueta',
            referencedColumnName: 'idLabel'
        }
    })
    tags: Label[];
}