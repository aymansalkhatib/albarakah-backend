import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';

/**
 * فلاتر متقدمة للبحث عن أعضاء العائلة، تشمل خصائص العضو وخصائص الشخص المرتبط
 */
export class FamilyMemberFilterDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  familyId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  personId?: number;

  @IsOptional()
  @IsEnum(FamilyRelationType)
  relationType?: FamilyRelationType;

  @IsOptional()
  @StrictBoolean()
  isSponsored?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
