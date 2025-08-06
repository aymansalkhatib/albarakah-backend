import { Expose, Type } from 'class-transformer';
import { CreateFamilyIncomeDto } from '../requests/create-family-income.dto';
import { FamilyResponseDto } from '@app/modules/families/dtos/responses/family-response.dto';
import { FamilyMemberResponseDto } from '@app/modules/family-members/dtos/responses/family-member-response.dto';

export class FamilyIncomeResponseDto extends CreateFamilyIncomeDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  familyMemberId?: number;

  @Expose()
  amount: number;

  @Expose()
  incomeSource: string;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Relationships
  @Expose()
  @Type(() => FamilyResponseDto)
  family: FamilyResponseDto;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMember?: FamilyMemberResponseDto;
}
