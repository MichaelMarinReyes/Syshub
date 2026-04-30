import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tecnologias')
export class Technology {
    @PrimaryGeneratedColumn('uuid', { name: 'id_tecnologia' })
    id: string;

    @Column({ name: 'nombre_tecnologia', type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ name: 'categoria', type: 'varchar', length: 50, nullable: true })
    category: string;
}