import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReceivedAssistanceDto } from './create-received-assistance.dto';

export class UpdateReceivedAssistanceDto extends PartialType(
  OmitType(CreateReceivedAssistanceDto, ['familyId']),
) {}
