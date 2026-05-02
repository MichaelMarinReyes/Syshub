import { Assignment } from "@/assignments/entities/assignment.entity";
import { CourseAssignment } from "@/course-assignment/entities/course-assignment.entity";
import { CourseAuxiliary } from "@/course-auxiliary/entities/course-auxiliary.entity";
import { Role } from "@/roles/entities/role.entity";
import { Status } from "@/statuses/entities/status.entity";
import { Session } from "inspector/promises";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id_usuario' })
    id: string;

    @Column({ name: 'nombre', type: 'varchar', length: 100 })
    firstName: string;

    @Column({ name: 'apellido', type: 'varchar', length: 100 })
    lastName: string;

    @Column({ name: 'correo', type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ name: 'password_hash', type: 'text', select: false })
    password: string;

    @Column({ name: 'id_rol', type: 'uuid' })
    roleId: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'id_rol' })
    role: Role;

    @Column({ name: 'id_estado', type: 'uuid' })
    statusId: string;

    @ManyToOne(() => Status, (status) => status.users)
    @JoinColumn({ name: 'id_estado' })
    status: Status;

    @CreateDateColumn({ name: 'fecha_registro', type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => CourseAuxiliary, (courseAuxiliary) => courseAuxiliary.user)
    auxiliaryAssignments: CourseAuxiliary[];

    @OneToMany(() => CourseAssignment, (courseAssignment) => courseAssignment.user)
    courseEnrollments: CourseAssignment[];

    @OneToMany(() => Assignment, (assignment) => assignment.user)
    submissions: Assignment[];
}