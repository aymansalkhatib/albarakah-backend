import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Road } from '../../interfaces';

export class RoadDto implements Road {
  @Expose()
  @IsOptional()
  @IsBoolean()
  isExtreme?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isPaved?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isDirt?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isClose?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
