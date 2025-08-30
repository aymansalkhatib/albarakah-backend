import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class CreateVisitDto {
  @IsOptional()
  @PositiveIntegerId()
  familyId?: number;

  @IsDateString()
  @IsNotEmpty()
  visitDate: string;

  @IsOptional()
  @IsDateString()
  visitDispatchDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  visitNotes?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  familyMembersCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  houseResidentsCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  familyHealthConditions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  visitCommitteeEvaluation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  finalEvaluation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  visitCommitteeMembers?: string[];
}
