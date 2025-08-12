import { Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from '../../../../modules/employees/dtos/responses/employee-response.dto';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';

export class InterviewResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId?: number;

  @Expose()
  interviewerId?: number;

  @Expose()
  interviewDate: Date;

  @Expose()
  purpose?: string;

  @Expose()
  summary?: string;

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
  @Type(() => EmployeeResponseDto)
  interviewer?: EmployeeResponseDto;
}
