// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Patch,
//   Post,
//   Query,
// } from '@nestjs/common';
// import { DropdownOptionService } from '../services/dropdown-option.service';
// import { CreateDropdownOptionDto } from '../dto/create-dropdown-option.dto';
// import { UpdateDropdownOptionDto } from '../dto/update-dropdown-option.dto';
// import { DropdownOption } from '../entities/dropdown-option.entity';
// import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
// import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';

// @Controller('dropdown-options')
// export class DropdownOptionController {
//   constructor(private readonly dropdownOptionService: DropdownOptionService) {}

//   @Post()
//   create(@Body() createDto: CreateDropdownOptionDto): Promise<DropdownOption> {
//     return this.dropdownOptionService.create(createDto);
//   }

//   @Get('by-dropdown/:dropdownId')
//   findAll(
//     @Param('dropdownId', ParseIntPipe) dropdownId: number,
//     @Query() paginationDto: PaginationDto,
//   ): Promise<PaginationResponseDto<DropdownOption>> {
//     return this.dropdownOptionService.findAll(dropdownId, paginationDto);
//   }

//   @Get('list/:dropdownId')
//   findByDropdown(@Param('dropdownId', ParseIntPipe) dropdownId: number): Promise<DropdownOption[]> {
//     return this.dropdownOptionService.findByDropdown(dropdownId);
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number): Promise<DropdownOption> {
//     return this.dropdownOptionService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDto: UpdateDropdownOptionDto,
//   ): Promise<DropdownOption> {
//     return this.dropdownOptionService.update(id, updateDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.dropdownOptionService.remove(id);
//   }
// }
