import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child } from './entities/children.entity';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  create(@Body() createChildDto: CreateChildDto) {
    return this.childrenService.create(createChildDto);
  }

  @Get()
  findAll() {
    return this.childrenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.findOne(id);
  }

  @Get('family/:familyId')
  findByFamilyId(@Param('familyId', ParseIntPipe) familyId: number) {
    return this.childrenService.findByFamilyId(familyId);
  }

  @Get('person/:personId')
  findByPersonId(@Param('personId', ParseIntPipe) personId: number) {
    return this.childrenService.findByPersonId(personId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateChildDto: UpdateChildDto) {
    return this.childrenService.update(id, updateChildDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.remove(id);
  }
}
