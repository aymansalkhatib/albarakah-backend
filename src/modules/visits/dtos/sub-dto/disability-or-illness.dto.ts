import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DisabilityStatus } from '../../enums/disability-status.enum';
import { DisabilityOrIllness } from '../../interfaces';

export class DisabilityOrIllnessDto implements DisabilityOrIllness {
  @Expose()
  @IsOptional()
  @IsEnum(DisabilityStatus)
  status?: DisabilityStatus;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
