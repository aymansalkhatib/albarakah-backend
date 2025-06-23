import { IsDate, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OnlyOneOf } from '../../../common/decorators/validate-one-of-two-fields.validator';
import { CreatePersonDto } from '../../persons/dto/create-person.dto';
import { SupportType } from '../enums/support-type';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateSupporterDto {
  @IsDate()
  @Type(() => Date)
  supportStartDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  supportEndDate?: Date;

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
