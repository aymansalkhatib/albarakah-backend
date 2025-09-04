import { IsDate, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OnlyOneOf } from '../../../../common/decorators/validate-one-of-two-fields.validator';
import { CreatePersonDto } from '../../../../modules/persons/dtos/requests/create-person.dto';
import { SupportType } from '../../enums/support-type';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateSupporterDto {


  @IsEnum(SupportType)
  @IsOptional()
  supportType?: SupportType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @IsOptional()
  personId?: number;
}
