import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { SupportType } from '../../enums/support-type';

export class FilterSupporterDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SupportType)
  supportType?: SupportType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
