import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from '@/roles/entities/role.entity';
import { Status } from '@/statuses/entities/status.entity';
import { Course } from '@/course/entities/course.entity';
import { CourseAssignment } from '@/course-assignment/entities/course-assignment.entity';
import { Assignment } from '@/assignments/entities/assignment.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id_usuario' })
  id!: string;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ name: 'apellido', type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ name: 'correo', unique: true, length: 50 })
  email!: string;

  @Column({ name: 'password_hash', select: false })
  password!: string;

  @Column({ name: 'id_rol' })
  roleId!: string;

  @Column({ name: 'id_estado' })
  statusId!: number;

  @CreateDateColumn({ name: 'fecha_registro' })
  createdAt!: Date;

  @ManyToOne(() => Status, (status) => status.users)
  @JoinColumn({ name: 'id_estado' })
  status!: Status;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'id_rol' })
  role!: Role;

  @OneToMany(() => Course, (course) => course.auxiliar)
  managedCourses!: Course[];

  @OneToMany(() => CourseAssignment, (assignment) => assignment.user)
  courseEnrollments!: CourseAssignment[];

  @OneToMany(() => Assignment, (submission) => submission.user)
  submissions!: Assignment[];
}