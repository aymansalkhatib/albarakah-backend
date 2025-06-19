// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
// import { DropdownSelectionService } from '../services/dropdown-selection.service';
// import { CreateDropdownSelectionDto } from '../dto/create-dropdown-selection.dto';
// import { DropdownSelection } from '../entities/dropdown-selection.entity';

// @Controller('dropdown-selections')
// export class DropdownSelectionController {
//   constructor(private readonly dropdownSelectionService: DropdownSelectionService) {}

//   @Post()
//   create(@Body() createDto: CreateDropdownSelectionDto): Promise<DropdownSelection> {
//     return this.dropdownSelectionService.create(createDto);
//   }

//   @Post('bulk/:recordType/:recordId')
//   bulkCreate(
//     @Param('recordId', ParseIntPipe) recordId: number,
//     @Param('recordType') recordType: string,
//     @Body() selections: CreateDropdownSelectionDto[],
//   ): Promise<DropdownSelection[]> {
//     return this.dropdownSelectionService.bulkCreate(recordId, recordType, selections);
//   }

//   @Get('by-record/:recordType/:recordId')
//   findByRecord(
//     @Param('recordId', ParseIntPipe) recordId: number,
//     @Param('recordType') recordType: string,
//   ): Promise<DropdownSelection[]> {
//     return this.dropdownSelectionService.findByRecord(recordId, recordType);
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number): Promise<DropdownSelection> {
//     return this.dropdownSelectionService.findOne(id);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.dropdownSelectionService.remove(id);
//   }

//   @Delete('by-record/:recordType/:recordId')
//   removeByRecord(
//     @Param('recordId', ParseIntPipe) recordId: number,
//     @Param('recordType') recordType: string,
//   ): Promise<void> {
//     return this.dropdownSelectionService.removeByRecord(recordId, recordType);
//   }
// }