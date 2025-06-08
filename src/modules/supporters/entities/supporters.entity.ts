import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupportType } from '../enums/support-type';

@Entity('supporters')
@Index(['personId'])
@Index(['supportType'])
@Index(['deletedAt'])
@Index(['supportStartDate', 'supportEndDate'])
export class Supporter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id', nullable: false })
  personId: number;

  @Column({ name: 'support_start_date', type: 'timestamp', nullable: false })
  supportStartDate: Date;

  @Column({ name: 'support_end_date', type: 'timestamp', nullable: true })
  supportEndDate?: Date;

  @Column({
    name: 'support_type',
    type: 'enum',
    enum: SupportType,
    nullable: true,
  })
  supportType?: SupportType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships

  @OneToOne(() => Person, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn()
  person: Person;
}
