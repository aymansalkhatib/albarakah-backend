import { IsOptional, IsString } from 'class-validator';
import { PositiveIntegerIdArray } from '../../../../common/decorators/positive-integer-id-array.decorator';
import { CreateRoleDto } from './create-role.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoleDto extends PartialType(CreateRoleDto){}