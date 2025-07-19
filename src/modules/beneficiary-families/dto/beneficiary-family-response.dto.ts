import { CreateBeneficiaryFamilyDto } from './create-beneficiary-family-dto';
import { Expose } from 'class-transformer';
import { IsDateString, IsUUID } from 'class-validator';

export class BeneficiaryFamilyResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyName: string;

  @Expose()
  familyBookNumber: string;

  @Expose()
  landlinePhone?: string;

  @Expose()
  mobilePhone?: string;

  @Expose()
  isDisplaced?: boolean;

  @Expose()
  isExtremelyPoor?: boolean;

  @Expose()
  voucherAmount?: number;

  @Expose()
  familySuspensionDate?: string;

  @Expose()
  suspensionReason?: string;

  @Expose()
  motherIsTrainingBeneficiary?: boolean;

  @Expose()
  childrenSchoolExpenses: number;

  @Expose()
  incomeFromBarakaAssociation: number;

  @Expose()
  registrationDate?: string;

  @Expose()
  lastAssessmentDate?: Date;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
