import { IsNumber, IsPositive } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class CreateUploadDto {
  @IsNumber()
  @IsPositive()
  @PositiveIntegerId()
  personId: number;
}
