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
import { EmployeesService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dtos/requests/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/responses/employee-response.dto';
import { UpdateEmployeeDto } from '../dtos/requests/update-employee.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Protected(Permission.CREATE_EMPLOYEE)
  @SerializeResponse(EmployeeResponseDto)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_EMPLOYEE)
  @SerializeResponse(EmployeeResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_EMPLOYEE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.employeesService.delete(id);
  }

  @Get(':id')
  @Protected(Permission.READ_EMPLOYEE)
  @SerializeResponse(EmployeeResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeResponseDto> {
    return this.employeesService.findOne(id, { relations: ['person'] });
  }

  @Get()
  @Protected(Permission.READ_EMPLOYEE)
  async findAll(@Query() filterDto: any): Promise<PaginationResponseDto<EmployeeResponseDto>> {
    return this.employeesService.findAll(filterDto);
  }
}
