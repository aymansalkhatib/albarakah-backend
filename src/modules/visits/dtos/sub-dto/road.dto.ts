import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Road } from '../../interfaces';

export class RoadDto implements Road {
  @IsOptional()
  isExtreme?: boolean;

  @IsOptional()
  isPaved?: boolean;

  @IsOptional()
  isDirt?: boolean;

  @IsOptional()
  isClose?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
