import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DisabilityStatus } from '../../enums/disability-status.enum';
import { DisabilityOrIllness } from '../../interfaces';

export class DisabilityOrIllnessDto implements DisabilityOrIllness {
  @IsOptional()
  @IsEnum(DisabilityStatus)
  status?: DisabilityStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
