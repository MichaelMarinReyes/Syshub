import { Course } from "@/course/entities/course.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('pensum')
export class Pensum {
    @PrimaryGeneratedColumn('uuid', { name: 'id_persona' })
    id: string;

    @Column({ name: 'codigo_pensum', type: 'varchar', length: 20 })
    code: string;

    @Column({ name: 'anio_vigencia', type: 'integer' })
    effectiveYear: number;

    @OneToMany(() => Course, (course) => course.pensum)
    courses: Course[]
}