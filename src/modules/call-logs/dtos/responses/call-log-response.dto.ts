import { Expose, Type } from 'class-transformer';
import { CallStatus } from '../../enums/call-status.enum';
import { ExternalPartyType } from '../../enums/recipient-type.enum';
import { EmployeeResponseDto } from '../../../../modules/employees/dtos/responses/employee-response.dto';
import { CallDirection } from '../../enums/call-direction.enum';
import { PersonResponseDto } from '../../../../modules/persons/dtos/responses/person-response.dto';

export class CallLogResponseDto {
  @Expose()
  id: number;

  @Expose()
  callerNumber?: string;

  @Expose()
  recipientNumber: string;

  @Expose()
  callStatus: CallStatus;

  @Expose()
  externalPartyType: ExternalPartyType;

  @Expose()
  responsibleEmployeeId?: number;

  @Expose()
  externalPartyId?: number;

  @Expose()
  callDirection: CallDirection;

  @Expose()
  callDate: Date;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => EmployeeResponseDto)
  responsibleEmployee?: EmployeeResponseDto;

  @Expose()
  @Type(() => PersonResponseDto)
  externalParty?: PersonResponseDto;
}
