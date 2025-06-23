import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class UpdateSelectedDropdownOptionDto {
  @IsOptional()
  @PositiveIntegerId()
  @Expose()
  selectedOptionId?: number;
}
