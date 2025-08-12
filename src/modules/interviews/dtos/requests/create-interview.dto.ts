import { IsDate, IsOptional, IsString } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class CreateInterviewDto {
  @PositiveIntegerId()
  familyId?: number;

  @IsOptional()
  @PositiveIntegerId()
  interviewerId?: number;

  @IsDate()
  interviewDate: Date;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
