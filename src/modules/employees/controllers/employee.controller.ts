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
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dtos/requests/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/responses/employee-response.dto';
import { UpdateEmployeeDto } from '../dtos/requests/update-employee.dto';

@Controller('employees')
@UseInterceptors(EmployeeResponseDto)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.employeesService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id, { relations: ['person'] });
  }

  @Get()
  async findAll(@Query() filterDto: any) {
    return this.employeesService.findAll(filterDto);
  }
}
