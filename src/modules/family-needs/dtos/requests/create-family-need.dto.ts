import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PriorityLevel } from '../../enums/priority-level.enum';
import { FamilyNeedStatus } from '../../enums/family-need-status.enum';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';

export class CreateFamilyNeedDto {
  @PositiveIntegerId()
  familyId: number;

  @IsOptional()
  @PositiveIntegerId()
  familyMemberId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  needType: string;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  quantity?: number;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priorityLevel?: PriorityLevel;

  @IsOptional()
  @IsEnum(FamilyNeedStatus)
  status?: FamilyNeedStatus;
}
