import { Publication } from '@/publications/entities/publication.entity';
import { User } from '@/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('estados')
export class Status {
    @PrimaryGeneratedColumn('uuid', { name: 'id_estado' })
    id!: string;

    @Column({name: 'nombre_estado'})
    name!: string;

    @OneToMany(() => User, (user) => user.status)
    users!: User[]

    @OneToMany(() => Publication, (publication) => publication.status)
    publications!: Publication[];
}
