import { Person } from 'src/modules/persons/entities/person.entity';
import { UserAccount } from 'src/modules/users/entities/user-accounts.entity';
import { CoreEntity } from 'src/shared/modules/app-type-orm/entities/core.entity';
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
  OneToMany,
} from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity';

@Entity('employees')
@Index(['personId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['position'])
@Index(['hireDate'])
@Index(['terminationDate'])
@Index(['deletedAt'])
export class Employee extends CoreEntity {
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

  @ManyToOne(() => Person, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(() => UserAccount, (userAccount) => userAccount.employee, {
    cascade: ['insert', 'update'],
  })
  userAccount?: UserAccount;

  @OneToMany(() => Interview, (interview) => interview.interviewer, {
    cascade: ['insert', 'update'],
  })
  interviews: Interview[];
}
