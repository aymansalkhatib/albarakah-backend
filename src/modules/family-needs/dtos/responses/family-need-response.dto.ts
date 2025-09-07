import { Expose, Type } from 'class-transformer';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';
import { FamilyMemberResponseDto } from '../../../../modules/family-members/dtos/responses/family-member-response.dto';
import { FamilyNeedStatus } from '../../enums/family-need-status.enum';
import { PriorityLevel } from '../../enums/priority-level.enum';

export class FamilyNeedResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  needType: string;

  @Expose()
  notes?: string;

  @Expose()
  quantity?: number;

  @Expose()
  priorityLevel: PriorityLevel;

  @Expose()
  status: FamilyNeedStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Related entities
  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMember?: FamilyMemberResponseDto;
}
