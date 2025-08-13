import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../../.././modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '../../.././modules/roles/dtos/requests/update-role.dto';
import { FilterRoleDto } from '../../.././modules/roles/dtos/queries/filter-role.dto';
import { PaginationResponseDto } from '../../.././common/pagination/dto/pagination-response.dto';
import { RoleResponseDto } from '../dtos/responses/role-response.dto';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../enums/permission.enum';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Protected(Permission.CREATE_ROLE)
  @SerializeResponse(RoleResponseDto)
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @Protected(Permission.READ_ROLE)
  findAllRole(@Query() filterDto: FilterRoleDto): Promise<PaginationResponseDto<RoleResponseDto>> {
    return this.rolesService.findAllRole(filterDto);
  }

  @Get(':id')
  @SerializeResponse(RoleResponseDto)
  @Protected(Permission.READ_ROLE)
  findRoleById(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.rolesService.findRoleById(id);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_ROLE)
  @SerializeResponse(RoleResponseDto)
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_ROLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolesService.deleteRole(id);
  }
}
