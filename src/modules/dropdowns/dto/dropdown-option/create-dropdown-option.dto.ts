import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class CreateDropdownOptionDto {
  @PositiveIntegerId()
  dropdownId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
