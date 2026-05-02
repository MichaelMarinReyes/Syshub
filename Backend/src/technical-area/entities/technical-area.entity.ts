import { Course } from "@/course/entities/course.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('area_tecnica')
export class TechnicalArea {
    @PrimaryGeneratedColumn('uuid', { name: 'id_area' })
    id: string;

    @Column({ name: 'nombre_area', type: 'varchar', length: 100, unique: true })
    name: string;

    @OneToMany(() => Course, (course) => course.area)
    courses: Course[];
}