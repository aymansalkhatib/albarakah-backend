import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { RequestStatus } from '../../enums/request-status.enum';
import { PaginationQueryDto } from '../../../../common/pagination/dto/pagination-query.dto';

export class FamilyRegistrationFormFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @Expose()
  search?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  @Expose()
  requestStatus?: RequestStatus;

  @IsOptional()
  @IsString()
  @Expose()
  familyId?: string;
}
