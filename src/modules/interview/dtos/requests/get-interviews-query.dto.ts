import { Type } from 'class-transformer';
import { IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FamilyMemberFilterDto } from '../../../family-members/dtos/queries/family-member-filter.dto';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';

export class GetInterviewsQueryDto extends PaginationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FamilyMemberFilterDto)
  familyMember?: FamilyMemberFilterDto;

  @IsOptional()
  @StrictBoolean()
  isVisited?: boolean;
}
