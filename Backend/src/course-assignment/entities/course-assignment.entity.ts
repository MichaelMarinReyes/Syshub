import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { CourseAuxiliary } from '@/course-auxiliary/entities/course-auxiliary.entity';

@Entity('asignaciones_cursos')
@Unique(['idUser', 'idCourseAuxiliary'])
export class CourseAssignment {
    @PrimaryGeneratedColumn('uuid', { name: 'id_asignacion' })
    id: string;

    @Column({ name: 'id_usuario', type: 'uuid' })
    idUser: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    user: User;

    @Column({ name: 'id_curso_auxiliar', type: 'uuid' })
    idCourseAuxiliary: string;

    @ManyToOne(() => CourseAuxiliary, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_curso_auxiliar' })
    courseAuxiliary: CourseAuxiliary;

    @CreateDateColumn({ name: 'fecha_asignacion', type: 'timestamp' })
    assignedAt: Date;
}