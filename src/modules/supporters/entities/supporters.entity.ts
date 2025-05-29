import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { SupportType } from '../enums/support-type';
import { CoreEntity } from 'src/shared/modules/app-type-orm/entities/core.entity';

@Entity('supporters')
@Index(['personId'])
@Index(['supportType'])
@Index(['deletedAt'])
@Index(['supportStartDate', 'supportEndDate'])
export class Supporter extends CoreEntity {
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

  // Relationships

  @OneToOne(() => Person, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn()
  person: Person;
}
