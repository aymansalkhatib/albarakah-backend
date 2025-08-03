import { Expose } from 'class-transformer';

export class FamilyResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyName: string;

  @Expose()
  familyBookNumber: string;

  @Expose()
  landlinePhone?: string;

  @Expose()
  isDisplaced?: boolean;

  @Expose()
  isExtremelyPoor?: boolean;

  @Expose()
  voucherAmount?: number;

  @Expose()
  familySuspensionDate?: Date;

  @Expose()
  suspensionReason?: string;

  @Expose()
  motherIsTrainingBeneficiary?: boolean;

  @Expose()
  childrenSchoolExpenses: number;

  @Expose()
  incomeFromBarakaAssociation: number;

  @Expose()
  registrationDate?: Date;

  @Expose()
  lastAssessmentDate?: Date;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
