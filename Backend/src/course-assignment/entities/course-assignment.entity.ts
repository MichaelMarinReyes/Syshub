import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Course } from '@/course/entities/course.entity';

@Entity('asignaciones_cursos')
@Unique(['idUser', 'idCourse'])
export class CourseAssignment {
    @PrimaryGeneratedColumn('uuid', { name: 'id_asignacion' })
    id!: string;

    @Column({ name: 'id_usuario', type: 'uuid' })
    idUser!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    user!: User;

    @Column({ name: 'id_curso', type: 'uuid' })
    idCourse!: string;

    @ManyToOne(() => Course, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_curso' })
    course!: Course;

    @CreateDateColumn({ name: 'fecha_asignacion', type: 'timestamp' })
    assignedAt!: Date;
}