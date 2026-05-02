import { CourseAssignment } from "@/course-assignment/entities/course-assignment.entity";
import { Pensum } from "@/pensum/entities/pensum.entity";
import { Publication } from "@/publications/entities/publication.entity";
import { TechnicalArea } from "@/technical-area/entities/technical-area.entity";
import { User } from "@/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cursos')
export class Course {
    @PrimaryGeneratedColumn('uuid', { name: 'id_curso' })
    id: string;

    @Column({ name: 'nombre_curso', type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'uuid', name: 'id_area', nullable: true })
    idArea: string;

    @ManyToOne(() => TechnicalArea, (area) => area.courses)
    @JoinColumn({ name: 'id_area' })
    area: TechnicalArea;

    @Column({ type: 'uuid', name: 'id_pensum', nullable: true })
    idPensum: string;

    @ManyToOne(() => Pensum, (pensum) => pensum.courses)
    @JoinColumn({ name: 'id_pensum' })
    pensum: Pensum;

    @Column({ name: 'id_auxiliar', type: 'uuid', nullable: true })
    idAuxiliar!: string;

    @ManyToOne(() => User, (user) => user.managedCourses)
    @JoinColumn({ name: 'id_auxiliar' })
    auxiliar!: User;

    // Relación para ver a todos los estudiantes asignados
    @OneToMany(() => CourseAssignment, (assignment) => assignment.course)
    assignments!: CourseAssignment[];

    // Relación con publicaciones (material didáctico)
    @OneToMany(() => Publication, (publication) => publication.course)
    publications!: Publication[];
}