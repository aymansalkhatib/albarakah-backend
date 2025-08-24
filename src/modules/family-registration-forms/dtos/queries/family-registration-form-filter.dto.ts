import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/pagination/dto/pagination-query.dto';
import { RequestStatus } from '../../enums/request-status.enum';

export class FamilyRegistrationFormFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @Expose()
  search?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  @Expose()
  requestStatus?: RequestStatus;
}
