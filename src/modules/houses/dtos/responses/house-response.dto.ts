import { FamilyResponseDto } from '@app/modules/families/dtos/responses/family-response.dto';
import { Expose, Type } from 'class-transformer';

export class HouseResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  locationText?: string;

  @Expose()
  coordinates?: string;

  @Expose()
  isRented: boolean;

  @Expose()
  rentAmount?: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;
}
