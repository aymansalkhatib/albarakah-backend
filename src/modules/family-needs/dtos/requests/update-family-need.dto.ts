import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFamilyNeedDto } from './create-family-need.dto';

export class UpdateFamilyNeedDto extends OmitType(PartialType(CreateFamilyNeedDto), [
  'familyMemberId',
  'familyId',
]) {}
