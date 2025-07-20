import { IsOptional, IsEnum, IsString, IsNumber, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CallStatus } from '../enums/call-status.enum';
import { CallerTypeEnum } from '../enums/caller-type.enum';
import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';

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
  @IsEnum(CallerTypeEnum)
  callerType?: CallerTypeEnum;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  createdFrom?: Date;

  @IsOptional()
  @IsDateString()
  createdTo?: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  familyId?: number;

  @IsOptional()
  @IsString()
  familyName?: string;
}