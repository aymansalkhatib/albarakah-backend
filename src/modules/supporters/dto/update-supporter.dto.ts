import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSupporterDto } from './create-supporter.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdatePersonDto } from 'src/modules/persons/dto/update-person.dto';

export class UpdateSupporterDto extends PartialType(
  OmitType(CreateSupporterDto, ['person', 'personId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
