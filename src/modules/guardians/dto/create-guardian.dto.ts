import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FamilyRelationType } from '../../beneficiary-families/enums/family-relation-type.enum';
import { Type } from 'class-transformer';
import { OnlyOneOf } from '../../../common/decorators/validate-one-of-two-fields.validator';
import { CreatePersonDto } from '@app/modules/persons/dtos/requests/create-person.dto';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateGuardianDto {
  @IsEnum(FamilyRelationType)
  @IsOptional()
  relationType?: FamilyRelationType;

  @IsDate()
  @Type(() => Date)
  guardianshipStartDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  guardianshipEndDate?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @IsOptional()
  @IsNumber()
  personId?: number;
}
