import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class CreateDropdownCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @PositiveIntegerId()
  parentId?: number;
}
