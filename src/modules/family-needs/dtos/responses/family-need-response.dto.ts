import { Expose, Type } from 'class-transformer';
import { PriorityLevel } from '../../enums/priority-level.enum';
import { FamilyNeedStatus } from '../../enums/family-need-status.enum';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';
import { FamilyMemberResponseDto } from '../../../../modules/family-members/dtos/responses/family-member-response.dto';

export class FamilyNeedResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  familyMemberId?: number;

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
