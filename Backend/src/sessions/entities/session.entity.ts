import { User } from '@/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sesiones')
export class Session {
  @PrimaryGeneratedColumn('uuid', { name: 'id_sesion' })
  id: string;

  @Column({ name: 'token_sesion', type: 'text' })
  sessionToken: string;

  @CreateDateColumn({ name: 'fecha_inicio', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'ip_origen', type: 'varchar', length: 45, nullable: true })
  ipOrigin: string;

  @Column({ name: 'dispositivo', type: 'text', nullable: true })
  device: string;

  @Column({ name: 'id_usuario', type: 'uuid', nullable: true })
  idUser: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user: User;
}