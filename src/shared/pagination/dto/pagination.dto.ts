import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortDto {
  @IsString()
  field: string;

  @IsEnum(SortOrder)
  order: SortOrder;
}

@Exclude()
export class PaginationDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sort?: SortDto[];
}
