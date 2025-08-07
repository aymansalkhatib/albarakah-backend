import { IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { PriorityLevel } from '../../enums/priority-level.enum';
import { FamilyNeedStatus } from '../../enums/family-need-status.enum';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';
import { ValidateMinMaxPairs } from '@app/common/decorators/validate-min-max-pairs-constraint';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';

@ValidateMinMaxPairs()
export class FilterFamilyNeedDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  familyId?: number;

  @IsOptional()
  @PositiveIntegerId()
  familyMemberId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  needType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  minQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  maxQuantity?: number;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priorityLevel?: PriorityLevel;

  @IsOptional()
  @IsEnum(FamilyNeedStatus)
  status?: FamilyNeedStatus;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
