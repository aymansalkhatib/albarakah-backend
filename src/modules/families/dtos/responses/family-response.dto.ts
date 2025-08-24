import { FamilyMemberResponseDto } from '../../../family-members/dtos/responses/family-member-response.dto';
import { GuardianResponseDto } from '../../../guardians/dtos/responses/guardian-response.dto';
import { HouseResponseDto } from '../../../houses/dtos/responses/house-response.dto';
import { Expose, Type } from 'class-transformer';

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

  @Expose()
  guardianId?: number;

  @Expose()
  @Type(() => GuardianResponseDto)
  guardian?: GuardianResponseDto;

  @Expose()
  @Type(() => HouseResponseDto)
  houses?: HouseResponseDto[];

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMembers?: FamilyMemberResponseDto[];
}
