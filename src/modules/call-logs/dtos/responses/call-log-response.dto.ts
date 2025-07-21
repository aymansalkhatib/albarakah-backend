import { Expose, Type } from 'class-transformer';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';
import { EmployeeResponseDto } from '@app/modules/employees/dtos/responses/employee-response.dto';
import { CallDirection } from '../../enums/call-direction.enum';

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
  receiverId: number;

  @Expose()
  recipientType: RecipientType;

  @Expose()
  responsibleEmployeeId?: number;

  @Expose()
  relatedPersonId?: number;

  @Expose()
  callDirection: CallDirection;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee?: EmployeeResponseDto;
}
