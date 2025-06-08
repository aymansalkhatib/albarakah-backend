import { Person } from 'src/modules/persons/entities/person.entity';
import { UserAccount } from 'src/modules/users/entities/user-accounts.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity';

@Entity('employees')
@Index(['personId'], { unique: true })
@Index(['position'])
@Index(['hireDate'])
@Index(['terminationDate'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id', unique: true })
  personId: number;

  @Column({ length: 100, nullable: true })
  position?: string;

  @Column({ type: 'date', nullable: true })
  hireDate?: Date;

  @Column({ type: 'date', nullable: true })
  terminationDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //

  @ManyToOne(() => Person, { nullable: false, onDelete: 'RESTRICT', cascade: true })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(() => UserAccount, (userAccount) => userAccount.employee, {
    cascade: true,
  })
  userAccount?: UserAccount;

  @OneToMany(() => Interview, (interview) => interview.interviewer, {
    cascade: true,
  })
  interviews: Interview[];
}
