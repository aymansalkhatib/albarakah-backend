import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsDateString,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { FilterEmployeeDto } from '@app/modules/employees/dtos/queries/filter-employee.dto';

export class FilterCallLogDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  callerNumber?: string;

  @IsOptional()
  @IsString()
  recipientNumber?: string;

  @IsOptional()
  @IsEnum(CallStatus)
  callStatus?: CallStatus;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  receiverId?: number;

  @IsOptional()
  @IsEnum(RecipientType)
  recipientType: RecipientType;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDate()
  callDateFrom?: Date;

  @IsOptional()
  @IsAfterDate('callDateFrom')
  callDateTo?: Date;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  callerName?: string;
}
