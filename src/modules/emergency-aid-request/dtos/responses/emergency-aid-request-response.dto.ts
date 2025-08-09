import { Expose, Type } from 'class-transformer';
import { EmergencyAidRequestStatus } from '../../enums/emergency-aid-request-status.enum';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';

export class EmergencyAidRequestResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  requestStatus: EmergencyAidRequestStatus;

  @Expose()
  requestedAmount: number;

  @Expose()
  disbursedAmount?: number;

  @Expose()
  notes?: string;

  @Expose()
  requestDate: Date;

  @Expose()
  disbursementDate?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;
}
