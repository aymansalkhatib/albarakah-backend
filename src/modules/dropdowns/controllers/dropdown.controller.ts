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
// import { DropdownService } from '../services/dropdown.service';
// import { CreateDropdownDto } from '../dto/create-dropdown.dto';
// import { UpdateDropdownDto } from '../dto/update-dropdown.dto';
// import { Dropdown } from '../entities/dropdown.entity';
// import { FilterDropdownDto } from '../dto/filter-dropdown.dto';
// import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
// import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';

// @Controller('dropdowns')
// export class DropdownController {
//   constructor(private readonly dropdownService: DropdownService) {}

//   @Post()
//   create(@Body() createDto: CreateDropdownDto): Promise<Dropdown> {
//     return this.dropdownService.create(createDto);
//   }

//   @Get()
//   findAll(
//     @Query() filter: FilterDropdownDto,
//     @Query() paginationDto: PaginationDto,
//   ): Promise<PaginationResponseDto<Dropdown>> {
//     return this.dropdownService.findAll(filter, paginationDto);
//   }

//   @Get('by-category/:categoryId')
//   findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Dropdown[]> {
//     return this.dropdownService.findByCategory(categoryId);
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number): Promise<Dropdown> {
//     return this.dropdownService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDto: UpdateDropdownDto,
//   ): Promise<Dropdown> {
//     return this.dropdownService.update(id, updateDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.dropdownService.remove(id);
//   }
// }
