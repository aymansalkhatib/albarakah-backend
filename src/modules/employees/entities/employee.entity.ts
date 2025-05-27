import { Person } from 'src/modules/persons/entities/person.entity';
import { UserAccount } from 'src/modules/users/entities/user-accounts.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  OneToOne,
  Index,
} from 'typeorm';

@Entity('employees')
@Index(['personId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['position'])
@Index(['hireDate'])
@Index(['terminationDate'])
@Index(['deletedAt'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id' })
  personId: number;

  @Column({ length: 100, nullable: true })
  position?: string;

  @Column({ type: 'date', nullable: true })
  hireDate?: string;

  @Column({ type: 'date', nullable: true })
  terminationDate?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Person, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(() => UserAccount, (userAccount) => userAccount.employee, {
    cascade: ['insert', 'update'],
  })
  userAccount?: UserAccount;
}
