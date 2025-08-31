import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../../persons/entities/person.entity';
import { SupportType } from '../enums/support-type';
import { SupporterChildSponsorship } from './supporters-children.entity';

@Entity('supporters')
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

  // Relationships

  @OneToMany(
    () => SupporterChildSponsorship,
    (sponsorship) => sponsorship.supporter,
  )
  childSponsorships: SupporterChildSponsorship[];

  @OneToOne(() => Person, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;
}
