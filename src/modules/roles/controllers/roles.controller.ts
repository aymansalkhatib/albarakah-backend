import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '@app/modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '@app/modules/roles/dtos/requests/update-role.dto';
import { FilterRoleDto } from '@app/modules/roles/dtos/queries/filter-role.dto';
import { toDto } from '@app/common/helpers/to-dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { RoleResponseDto } from '../dtos/responses/role-response.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Get()
  findAllRole(@Query() filterDto: FilterRoleDto): Promise<PaginationResponseDto<RoleResponseDto>> {
    return this.rolesService.findAllRole(filterDto);
  }

  @Get(':id')
  async findRoleById(@Param('id', ParseIntPipe) id: number) {
    let role = await this.rolesService.findRoleById(id);
    return toDto(RoleResponseDto, role);
  }

  @Patch(':id')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }
}
