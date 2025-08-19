import { UpdateHouseDto } from '../../../houses/dtos';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CreateVisitDto } from './create-visit.dto';

export class UpdateVisitDto extends OmitType(PartialType(CreateVisitDto), ['house', 'familyId']) {
  @IsOptional()
  @Type(() => UpdateHouseDto)
  house?: UpdateHouseDto;
}
