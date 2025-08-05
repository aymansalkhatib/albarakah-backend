import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { GenderType } from '@app/modules/persons/enums/gender-type.enum';
import { Type } from 'class-transformer';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { StrictBoolean } from '@app/common/decorators/strict-boolean.decorator';

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
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
