import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTrainingCourseDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
