import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../families/entities/families.entity';
import { FamilyRelationType } from '../../family-members/enums/family-relation-type.enum';
import { HouseCondition, HouseOwnership } from '../enums';
import { AlBarakaCharityIncomeAmount } from '../enums/al-baraka-charity-income-amount.enum';
import {
  Beds,
  Blankets,
  CarpetsAndMats,
  CoolingDevices,
  DisabilityOrIllness,
  Furnishings,
  GasOven,
  HeatingDevices,
  HouseholdItems,
  Income,
  Quilts,
  Refrigerator,
  Road,
  VisitCommitteeEvaluation,
  Wardrobes,
  WashingMachine,
  WorkingIndividual,
} from '../interfaces';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_id', type: 'int' })
  familyId: number;

  @Column({ name: 'visit_date', type: 'date' })
  visitDate: Date;

  @Column({
    name: 'committee_notes_and_suggestions_of_the_visit_committee',
    type: 'text',
    nullable: true,
  })
  committeeNotesAndSuggestionsOfTheVisitCommittee?: string;

  @Column({
    name: 'paper_sent_date_of_the_visit',
    type: 'date',
    nullable: true,
  })
  paperSentDateOfTheVisit?: Date;

  @Column({
    name: 'guardian_relationship',
    type: 'enum',
    enum: FamilyRelationType,
    nullable: true,
  })
  guardianRelationship?: FamilyRelationType;

  @Column({ name: 'number_of_family_members', type: 'int' })
  numberOfFamilyMembers: number;

  @Column({
    name: 'number_of_remaining_family_members_in_the_house',
    type: 'int',
  })
  numberOfRemainingFamilyMembersInTheHouse: number;

  @Column({ name: 'road', type: 'json', nullable: true })
  road?: Road;

  @Column({
    name: 'house_condition',
    type: 'enum',
    enum: HouseCondition,
    nullable: true,
  })
  houseCondition?: HouseCondition;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({
    name: 'house_ownership',
    type: 'enum',
    enum: HouseOwnership,
    nullable: true,
  })
  houseOwnership?: HouseOwnership;

  @Column({ name: 'furnishings', type: 'json', nullable: true })
  furnishings?: Furnishings;

  @Column({ name: 'carpets_and_mats', type: 'json', nullable: true })
  carpetsAndMats?: CarpetsAndMats;

  @Column({ name: 'blankets', type: 'json', nullable: true })
  blankets?: Blankets;

  @Column({ name: 'quilts', type: 'json', nullable: true })
  quilts?: Quilts;

  @Column({ name: 'beds', type: 'json', nullable: true })
  beds?: Beds;

  @Column({ name: 'wardrobes', type: 'json', nullable: true })
  wardrobes?: Wardrobes;

  @Column({ name: 'household_items', type: 'json', nullable: true })
  householdItems?: HouseholdItems;

  @Column({ name: 'washing_machine', type: 'json', nullable: true })
  washingMachine?: WashingMachine;

  @Column({ name: 'gas_oven', type: 'json', nullable: true })
  gasOven?: GasOven;

  @Column({ name: 'cooling_devices', type: 'json', nullable: true })
  coolingDevices?: CoolingDevices;

  @Column({ name: 'refrigerator', type: 'json', nullable: true })
  refrigerator?: Refrigerator;

  @Column({ name: 'heating_devices', type: 'json', nullable: true })
  heatingDevices?: HeatingDevices;

  @Column({ name: 'waste_basket', type: 'text', nullable: true })
  wasteBasket?: string;

  @Column({
    name: 'school_expenses',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  schoolExpenses?: number;

  @Column({ name: 'clothes_condition', type: 'text', nullable: true })
  clothesCondition?: string;

  @Column({ name: 'shoes_condition', type: 'text', nullable: true })
  shoesCondition?: string;

  @Column({ name: 'food_supplies_condition', type: 'text', nullable: true })
  foodSuppliesCondition?: string;

  @Column({
    name: 'needs_or_luxuries_not_reported_in_the_paper',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  needsOrLuxuriesNotReportedInThePaper?: string;

  @Column({
    name: 'baraka_association_income',
    type: 'enum',
    enum: AlBarakaCharityIncomeAmount,
    nullable: true,
  })
  barakaAssociationIncome?: AlBarakaCharityIncomeAmount;

  @Column({ name: 'income', type: 'json', nullable: true })
  income?: Income;

  @Column({
    name: 'available_spending_without_association',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  availableSpendingWithoutAssociation?: number;

  @Column({
    name: 'total_income_without_association',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalIncomeWithoutAssociation?: number;

  @Column({
    name: 'amount_of_rent_if_the_applicant_is_the_one_paying_it',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  amountOfRentIfTheApplicantIsTheOnePayingIt?: number;

  @Column({ name: 'working_individual', type: 'json', nullable: true })
  workingIndividual?: WorkingIndividual;

  @Column({ name: 'disability_or_illness', type: 'json', nullable: true })
  disabilityOrIllness?: DisabilityOrIllness;

  @Column({ name: 'visit_committee_evaluation', type: 'json', nullable: true })
  visitCommitteeEvaluation?: VisitCommitteeEvaluation;

  @Column({
    name: 'committee_members',
    type: 'varchar',
    array: true,
    nullable: true,
  })
  committeeMembers?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @ManyToOne(() => Family, (family) => family.visits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;
}
