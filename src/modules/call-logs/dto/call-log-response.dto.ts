import { Exclude, Expose, Type } from 'class-transformer';
import { CallStatus } from '../enums/call-status.enum';
import { CallerTypeEnum } from '../enums/caller-type.enum';

export class PersonResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;
}

export class EmployeeResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

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
  callerType: CallerTypeEnum;

  @Expose()
  employeeId?: number;

  @Expose()
  note?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PersonResponseDto)
  receiver?: PersonResponseDto;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee?: EmployeeResponseDto;

  @Expose()
  @Type(() => PersonResponseDto)
  caller?: PersonResponseDto;
}