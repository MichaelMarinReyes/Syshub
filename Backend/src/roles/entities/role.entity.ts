import { User } from "@/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid', { name: 'id_rol'})
    id: string;

    @Column({name: 'nombre_rol', type: 'varchar', length: 50, unique: true})
    name: string

    @Column({name: 'descripcion', type: 'varchar', length: 200})
    description: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[]
}