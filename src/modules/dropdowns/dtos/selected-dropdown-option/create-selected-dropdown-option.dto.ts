import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { RecordType } from '../../enums/recored-type.enums';

export class CreateSelectedDropdownOptionDto {
  @IsNumber()
  @IsNotEmpty()
  recordId: number;

  @IsEnum(RecordType)
  @IsNotEmpty()
  recordType: RecordType;

  @PositiveIntegerId()
  dropdownId: number;

  @PositiveIntegerId()
  categoryId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  selectedOptionId: number[];
}
