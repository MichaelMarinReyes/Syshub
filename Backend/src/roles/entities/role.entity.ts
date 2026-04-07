import { User } from '@/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'id_rol' })
  id!: string;

  @Column({ name: 'nombre_rol', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 200 })
  description!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[]
}
