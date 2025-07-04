import { Exclude, Expose, Type } from 'class-transformer';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { CourseBatchResponseDto } from './course-batch-response.dto';

@Exclude()
export class PersonCourseBatchResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyMemberId: number;

  @Expose()
  courseBatchId: number;

  @Expose()
  attendanceStatus?: AttendanceStatus;

  @Expose()
  evaluation?: string;

  @Expose()
  joinDate?: Date;

  @Expose()
  dropOutDate?: Date;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CourseBatchResponseDto)
  courseBatch?: CourseBatchResponseDto;

  // Family member info - will be loaded separately to avoid deep nesting
  @Expose()
  familyMember?: {
    id: number;
    personId: number;
    relationType: string;
    person?: {
      id: number;
      firstName: string;
      middleName?: string;
      lastName: string;
    };
  };
}
