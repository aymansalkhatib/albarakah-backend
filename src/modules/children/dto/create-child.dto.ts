import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChildDto {
  @ApiProperty({ description: 'معرف الشخص' })
  @IsNumber()
  @IsNotEmpty()
  personId: number;

  @ApiProperty({ description: 'معرف عضو العائلة' })
  @IsNumber()
  @IsNotEmpty()
  familyMemberId: number;

  @ApiProperty({ description: 'معرف العائلة المستفيدة' })
  @IsNumber()
  @IsNotEmpty()
  familyId: number;

  @ApiProperty({ description: 'هل هو مكفول', default: false })
  @IsBoolean()
  @IsOptional()
  isSponsored?: boolean;

  @ApiProperty({ description: 'ملاحظات', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
