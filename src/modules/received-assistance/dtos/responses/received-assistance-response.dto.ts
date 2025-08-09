import { Expose, Type } from 'class-transformer';
import { AssistanceType } from '../../enums/assistance-type.enum';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';
import { FamilyMemberResponseDto } from '../../../../modules/family-members/dtos/responses/family-member-response.dto';

export class ReceivedAssistanceResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  familyMemberId?: number;

  @Expose()
  assistanceType?: AssistanceType;

  @Expose()
  amount?: number;

  @Expose()
  deliveryDate: Date;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMember?: FamilyMemberResponseDto;
}
