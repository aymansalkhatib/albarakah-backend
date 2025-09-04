import { Expose, Type } from 'class-transformer';
import { FamilyResponseDto } from '../../../families/dtos/responses/family-response.dto';
import { FamilyMemberResponseDto } from '../../../family-members/dtos/responses/family-member-response.dto';

export class InterviewResponseDto {
  @Expose()
  @Type(() => FamilyResponseDto)
  family: FamilyResponseDto;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  guardian: FamilyMemberResponseDto;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMembers: FamilyMemberResponseDto[];
}
