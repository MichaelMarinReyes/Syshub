import { Pensum } from "@/pensum/entities/pensum.entity";
import { TechnicalArea } from "@/technical-area/entities/technical-area.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}