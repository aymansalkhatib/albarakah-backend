import { Expose } from 'class-transformer';

export class UploadResponseDto {
  @Expose()
  personId: number;

  @Expose()
  imageUrl: string;
}
