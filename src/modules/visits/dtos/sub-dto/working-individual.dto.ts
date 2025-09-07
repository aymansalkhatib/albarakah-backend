import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { WorkingIndividualAge } from '../../enums/working-individual-age-status';
import { WorkingIndividual } from '../../interfaces';

export class WorkingIndividualDto implements WorkingIndividual {
  @Expose()
  @IsOptional()
  @IsEnum(WorkingIndividualAge)
  age?: WorkingIndividualAge;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
