import { CourseAuxiliary } from "@/course-auxiliary/entities/course-auxiliary.entity";
import { Pensum } from "@/pensum/entities/pensum.entity";
import { TechnicalArea } from "@/technical-area/entities/technical-area.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cursos')
export class Course {
    @PrimaryGeneratedColumn('uuid', { name: 'id_curso' })
    id: string;

    @Column({ name: 'nombre_curso', type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'uuid', name: 'id_area', nullable: true })
    idArea: string;

    @ManyToOne(() => TechnicalArea)
    @JoinColumn({ name: 'id_area' })
    area: TechnicalArea;

    @Column({ type: 'uuid', name: 'id_pensum', nullable: true })
    idPensum: string;

    @ManyToOne(() => Pensum)
    @JoinColumn({ name: 'id_pensum' })
    pensum: Pensum;

    @OneToMany(() => CourseAuxiliary, (courseAuxiliary) => courseAuxiliary.course)
    auxiliaries: CourseAuxiliary[];
}