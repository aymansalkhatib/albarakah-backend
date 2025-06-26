import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { EntityType } from '../../enums/entity-type.const';

export class CreateSelectedDropdownOptionDto {
  @IsNumber()
  @IsNotEmpty()
  recordId: number;

  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @PositiveIntegerId()
  dropdownId: number;

  @PositiveIntegerId()
  categoryId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  selectedOptionId: number[];
}
