import { Expose, Type } from 'class-transformer';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';
import { FamilyMemberResponseDto } from '../../../../modules/family-members/dtos/responses/family-member-response.dto';
import { AssistanceType } from '../../enums/assistance-type.enum';

export class ReceivedAssistanceResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

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
