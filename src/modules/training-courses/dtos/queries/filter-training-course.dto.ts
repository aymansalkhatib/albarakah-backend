import { IsOptional, IsString, Length } from 'class-validator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';

export class FilterTrainingCourseDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  note?: string;
}
