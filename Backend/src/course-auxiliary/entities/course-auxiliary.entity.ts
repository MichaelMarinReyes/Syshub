import { CourseAssignment } from "@/course-assignment/entities/course-assignment.entity";
import { Course } from "@/course/entities/course.entity";
import { Publication } from "@/publications/entities/publication.entity";
import { User } from "@/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cursos_auxiliar')
export class CourseAuxiliary {
    @PrimaryGeneratedColumn('uuid', { name: 'id_curso_auxiliar' })
    id: string;

    @Column({ name: 'id_curso', type: 'uuid' })
    idCourse: string;

    @ManyToOne(() => Course, (course) => course.auxiliaries, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_curso' })
    course: Course;

    @Column({ name: 'id_usuario', type: 'uuid' })
    idUser: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    user: User;

    @Column({ name: 'codigo_acceso', type: 'varchar', length: 10, unique: true })
    accessCode: string;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => Publication, (publication) => publication.courseAuxiliary)
    publications: Publication[];

    @OneToMany(() => CourseAssignment, (assignment) => assignment.courseAuxiliary)
    assignments: CourseAssignment[];
}
