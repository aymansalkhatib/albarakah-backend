import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateVisitDto } from './create-visit.dto';

export class UpdateVisitDto extends OmitType(PartialType(CreateVisitDto), ['familyId']) {}
