import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeesService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { toDto } from 'src/common/helpers/to-dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';

@Controller('employees')
@UseInterceptors(EmployeeResponseDto)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeesService.create(createEmployeeDto);
    return employee;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.employeesService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Get()
  async findAll(@Query() filterDto: FilterEmployeeDto) {
    return this.employeesService.findAll(filterDto);
  }
}
